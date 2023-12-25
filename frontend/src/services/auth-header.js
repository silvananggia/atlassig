const userKey = process.env.REACT_APP_USER_KEY;
export default function authHeader() {
    const token = localStorage.getItem('token');

    if (token && userKey) {
      return {
        "token": token,
        "userkey":userKey
      };
    } else {
      return {};
    }
  }