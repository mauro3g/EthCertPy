export class DateFormatterUtil {
  formatDate(numberDate: number | string) {
    if(typeof numberDate === 'string') return numberDate
    let formDate = new Date(numberDate);
    return formDate.toLocaleDateString();
  }
}
