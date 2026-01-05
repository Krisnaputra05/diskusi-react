const BASE_URL = 'https://forum-api.dicoding.dev/v1';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function putAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

function removeAccessToken() {
  localStorage.removeItem('accessToken');
}

async function fetchWithAuth(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
}

const api = {
  putAccessToken,
  getAccessToken,
  removeAccessToken,

  async register({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { user } } = responseJson;
    return user;
  },

  async login({ email, password }) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { token } } = responseJson;
    return token;
  },

  async getOwnProfile() {
    const response = await fetchWithAuth(`${BASE_URL}/users/me`);
    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { user } } = responseJson;
    return user;
  },

  async getAllUsers() {
    const response = await fetch(`${BASE_URL}/users`);
    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { users } } = responseJson;
    return users;
  },

  async getAllThreads() {
    const response = await fetch(`${BASE_URL}/threads`);
    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { threads } } = responseJson;
    return threads;
  },

  async getThreadDetail(id) {
    const response = await fetch(`${BASE_URL}/threads/${id}`);
    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { detailThread } } = responseJson;
    return detailThread;
  },

  async createThread({ title, body, category = '' }) {
    const response = await fetchWithAuth(`${BASE_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body, category }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { thread } } = responseJson;
    return thread;
  },

  async createComment({ threadId, content }) {
    const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { comment } } = responseJson;
    return comment;
  },

  async upVoteThread(id) {
    const response = await fetchWithAuth(`${BASE_URL}/threads/${id}/up-vote`, {
      method: 'POST',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
    
    return responseJson.data.vote; 
  },

  async downVoteThread(id) {
    const response = await fetchWithAuth(`${BASE_URL}/threads/${id}/down-vote`, {
      method: 'POST',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
     return responseJson.data.vote; 
  },

  async neutralVoteThread(id) {
    const response = await fetchWithAuth(`${BASE_URL}/threads/${id}/neutral-vote`, {
      method: 'POST',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
     return responseJson.data.vote; 
  },
  
  // Comment Votes
  async upVoteComment({ threadId, commentId }) {
    const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`, {
      method: 'POST',
    });
     const responseJson = await response.json();
      const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
    return responseJson.data.vote;
  },

   async downVoteComment({ threadId, commentId }) {
    const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`, {
      method: 'POST',
    });
     const responseJson = await response.json();
      const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
    return responseJson.data.vote;
  },

  async neutralVoteComment({ threadId, commentId }) { // Added Logic for neutral
      const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`, {
      method: 'POST',
    });
     const responseJson = await response.json();
      const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
    return responseJson.data.vote;
  },

  async getLeaderboards() {
    const response = await fetch(`${BASE_URL}/leaderboards`);
    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { leaderboards } } = responseJson;
    return leaderboards;
  },
};

export default api;
