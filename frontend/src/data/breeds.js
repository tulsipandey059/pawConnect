export const PET_TYPES = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
];

export const dogBreeds = [
  'Labrador Retriever',
  'German Shepherd',
  'Golden Retriever',
  'Bulldog',
  'Beagle',
  'Poodle',
  'Rottweiler',
  'Yorkshire Terrier',
  'Boxer',
  'Dachshund',
];

export const catBreeds = [
  'Persian',
  'Maine Coon',
  'Siamese',
  'Ragdoll',
  'British Shorthair',
  'Abyssinian',
  'Sphynx',
  'Scottish Fold',
  'Bengal',
  'Russian Blue',
];

export const breedOptionsByType = {
  dog: dogBreeds,
  cat: catBreeds,
};

export const getBreedsByType = (type) => breedOptionsByType[type] || [];
