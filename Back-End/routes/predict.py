from fastapi import APIRouter, File, UploadFile
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
from PIL import Image
from config.db import db
import io
from motor.motor_asyncio import AsyncIOMotorGridFSBucket  # async GridFS

fs = AsyncIOMotorGridFSBucket(db)

router = APIRouter()

# Define the model architecture (same from notebook)
class ClientModel(nn.Module):
    def __init__(self, num_classes=4):
        super(ClientModel, self).__init__()
        
        # Feature extraction layers
        self.features = nn.Sequential(
            # First Block
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),  # 224 -> 112
            
            # Second Block
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),  # 112 -> 56
            
            # Third Block
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),  # 56 -> 28
        )
        
        # Classifier layers
        # For input size 224x224, after 3 MaxPool2d: 28x28
        # Final feature map size: 128 x 28 x 28 = 100352
        self.classifier = nn.Sequential(
            nn.Linear(128 * 28 * 28, 128),  # Adjust flattened size
            nn.ReLU(),
            nn.Dropout(0.5),  # Dropout to prevent overfitting
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)  # Flatten the tensor, size(0) keeps the batch dim
        x = self.classifier(x)
        return x

# Transformations to prepare input into the neural network
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Load the latest model from mongoDB GridFS
async def load_model_from_gridfs(model_name: str):
    model_metadata = await db.models.find_one({"model_name": model_name}, sort=[("_id", -1)])
    if not model_metadata:
        raise ValueError("Model not found in database.")

    file_id = model_metadata["file_id"]
    file_metadata = await db.fs.files.find_one({"_id": file_id})
    # Retrieve the uploadDate from fs.files metadata
    upload_date = file_metadata["uploadDate"]
    
    grid_out = await fs.open_download_stream(file_id)
    model_bytes = await grid_out.read()

    # Load the model from bytes
    model = ClientModel()
    model.load_state_dict(torch.load(io.BytesIO(model_bytes), map_location=torch.device("cpu")))
    model.eval()
    return model, upload_date


@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    image_size = image.size  # Size of the image (width, height)
    image_format = file.filename.split('.')[-1].upper()  # Image format (e.g., JPEG, PNG)
    image = transform(image).unsqueeze(0) 

    model, upload_date = await load_model_from_gridfs("my_model")  # model name

    with torch.no_grad():
        output = model(image)
        probabilities = F.softmax(output, dim=1)  # Convert logits to probabilities
        predicted_class = torch.argmax(probabilities, dim=1).item() # Argmax to get predicted class
        confidence_score = probabilities[0, predicted_class].item()  # Confidence score
        all_probs = probabilities.squeeze(0).tolist()  # Convert tensor to list

    return {
        "prediction": predicted_class,
        "confidence": round(confidence_score, 4),
        "probabilities": {f"class_{i}": round(prob, 4) for i, prob in enumerate(all_probs)},
        "model_upload_date": str(upload_date),
        "image_size": image_size,
        "image_format": image_format
    }
