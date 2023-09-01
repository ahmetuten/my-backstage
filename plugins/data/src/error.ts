export class FetchError extends Error {
    responseText?: string;
  
    static async forResponse(
      method: string,
      response: Response,
    ): Promise<FetchError> {
      const requestDescription = `${method} ${response.url}`;
      const statusDescription = `${response.status} ${response.statusText}`;
  
      const responseText = await response.text();
  
      const newFetchError = new FetchError(
        `${statusDescription}, ${requestDescription}`,
      );
      newFetchError.responseText = responseText;
  
      return newFetchError;
    }
  }