export interface CardModel {
    id?: string;
    title: string;
    subtitle?: string;
    description: string;
    imageSrc?: string;
    imageAlt?: string;
    linkText?: string;
    linkUrl?: string;
    cardType: 'service' | 'doctor' | 'info' | 'appointment';
    tags?: string[];
    rating?: number;
    featured?: boolean;
  }