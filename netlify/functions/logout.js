exports.handler = async () => {
  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': 'zkode_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
      'Location': '/login.html'
    },
    body: ''
  };
};
