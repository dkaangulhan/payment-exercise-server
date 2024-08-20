class DateFormatters {
  /**
   * @param {Date} date
   */
  toIyziDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Format the date string
    const formattedDate = `${year}-${day}-${month} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }
}

module.exports = DateFormatters;
