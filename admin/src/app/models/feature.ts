export interface Feature {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  image: string;
  room_class_used_list?: FeatureMapping[];
}

export interface FeatureMapping {
  _id: string;
  room_class_id?: {
    _id: string;
    name: string;
    description?: string;
    status: boolean;
  };
  feature_id: Feature;
}
