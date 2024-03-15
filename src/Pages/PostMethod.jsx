import React, { useState } from 'react';

const PostMethod = () => {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    {console.log(userId + " " + title)}
    e.preventDefault();
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, title }),
        
      });
      if (!response.ok) {
        throw new Error('Failed to submit data');
      }
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Submit Data</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className='bg-green-500 p-2'>User ID:</label>
          <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} />
        </div>
        <div>
          <label className='bg-pink-500 p-2'>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <button className='bg-orange-400 p-2' type="submit">Submit</button>
      </form>
      {error && <p>Error: {error}</p>}
      {response && (
        <div>
          <h2>Response</h2>
          <p>User ID: {response.userId}</p>
          <p>Title: {response.title}</p>
        </div>
      )}
    </div>
  );
};

export default PostMethod;
