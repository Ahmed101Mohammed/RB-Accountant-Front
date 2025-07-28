export const shiftArabicName = (englishName)=>
{
  const arabicName = englishName === 'morning'? 'صباحي' : englishName === 'night' ? 'مسائي' : 'إضافي';
  return arabicName;
}