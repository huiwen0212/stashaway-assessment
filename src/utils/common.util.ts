namespace CommonUtils {
  /**
   * Function to generate random string
   * @param n
   * @returns
   */
  export function generateRandomString(n: number) {
    let randomString = "";
    const characters = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

    for (let i = 0; i < n; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return randomString;
  }
}

export default CommonUtils;
