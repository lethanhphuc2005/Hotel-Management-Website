export interface Feature {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  image: string;
}

export interface FeatureMapping {
  _id: string;
  room_class_id: string;
  feature_id: Feature;
}
