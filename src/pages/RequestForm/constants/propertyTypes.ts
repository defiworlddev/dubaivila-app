import villaImage from '../../../assets/villa.webp';
import apartmentImage from '../../../assets/apartment.webp';
import officeImage from '../../../assets/office.webp';
import storeImage from '../../../assets/store.webp';
import otherImage from '../../../assets/other.webp';

export interface PropertyTypeOption {
  value: string;
  label: string;
  image: string;
  description: string;
}

export const propertyTypes: PropertyTypeOption[] = [
  {
    value: 'Villa',
    label: 'Villa',
    image: villaImage,
    description: 'Luxury standalone properties with private gardens',
  },
  {
    value: 'Apartment',
    label: 'Apartment',
    image: apartmentImage,
    description: 'Modern residential units in premium buildings',
  },
  {
    value: 'Office',
    label: 'Office',
    image: officeImage,
    description: 'Professional workspace solutions',
  },
  {
    value: 'Store',
    label: 'Retail Store',
    image: storeImage,
    description: 'Commercial retail spaces',
  },
  {
    value: 'Other',
    label: 'Other',
    image: otherImage,
    description: 'Other property types',
  },
];

