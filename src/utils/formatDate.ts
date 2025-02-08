export default function formatDate(date: Date): string {
  const dateString = date.toDateString();
  const dateParts = dateString.split(" ");
  const formattedDate = `${dateParts[1]}. ${dateParts[2]}, ${dateParts[3]}`;
  return formattedDate;
}
