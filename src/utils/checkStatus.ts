export const checkStatus = async (response: Response): Promise<Response> => {
  if (response.ok) {
    return response;
  } else {
    throw new Error(`Request failed with status ${response.status}`);
  }
};
