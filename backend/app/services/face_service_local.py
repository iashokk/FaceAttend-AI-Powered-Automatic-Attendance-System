# import face_recognition
# import numpy as np
# from typing import List, Tuple, Optional
# import io

# def extract_face_encodings(image_bytes: bytes) -> List[np.ndarray]:
#     image = face_recognition.load_image_file(io.BytesIO(image_bytes))
#     face_locations = face_recognition.face_locations(image)
#     if not face_locations:
#         return []
#     encodings = face_recognition.face_encodings(image, face_locations)
#     return encodings

# def find_best_match(
#     unknown_encoding: np.ndarray,
#     known_encodings: List[np.ndarray],
#     tolerance: float = 0.5,
# ) -> Tuple[Optional[int], Optional[float]]:
#     if not known_encodings:
#         return None, None
#     distances = face_recognition.face_distance(known_encodings, unknown_encoding)
#     best_index = int(np.argmin(distances))
#     best_distance = float(distances[best_index])
#     if best_distance <= tolerance:
#         return best_index, best_distance
#     return None, None


import numpy as np
import face_recognition
from typing import List, Tuple, Optional
import cv2  # pip install opencv-python


def extract_face_encodings(image_bytes: bytes) -> List[np.ndarray]:
    """
    Decode image bytes, detect faces, and return encodings as numpy arrays.
    Returns an empty list if no faces found or invalid image.
    """
    # Decode bytes → OpenCV image (BGR)
    nparr = np.frombuffer(image_bytes, np.uint8)
    img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img_bgr is None:
        return []

    # Convert BGR → RGB
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

    # Detect faces
    face_locations = face_recognition.face_locations(img_rgb)
    if not face_locations:
        return []

    encodings = face_recognition.face_encodings(img_rgb, face_locations)
    return encodings


def find_best_match(
    unknown_encoding: np.ndarray,
    known_encodings: List[np.ndarray],
    tolerance: float = 0.5,
) -> Tuple[Optional[int], Optional[float]]:
    """
    Returns (best_index, distance) if below tolerance, else (None, None)
    """
    if not known_encodings:
        return None, None

    distances = face_recognition.face_distance(known_encodings, unknown_encoding)
    best_idx = int(np.argmin(distances))
    best_dist = float(distances[best_idx])

    if best_dist <= tolerance:
        return best_idx, best_dist
    return None, None
