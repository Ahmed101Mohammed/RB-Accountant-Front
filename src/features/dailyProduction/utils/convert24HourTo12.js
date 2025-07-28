export const convert24HourTo12 = (hour24Sys) =>
{
  let hour12Sys = hour24Sys === 0 ? '12 AM' : hour24Sys < 12 ? `${hour24Sys} AM` : hour24Sys === 12 ? '12 PM' : `${hour24Sys - 12} PM`;
  hour12Sys = hour12Sys.padStart(5, '0');
  return hour12Sys;
}