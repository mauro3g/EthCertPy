export class DateFormatterUtil {
  formatDate(numberDate: number) {
    let formDate = new Date(numberDate);
    return formDate.toLocaleDateString();
  }
}
