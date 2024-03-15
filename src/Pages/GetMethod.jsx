import React, { useEffect, useState } from 'react';

const GetMethod = () => {
    const [posts, setPosts] = useState([]);
    const postData = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const json = await response.json();
        console.log(json);
        setPosts(json);
      } catch (error) {
        console.log("error", error);
      }
    }
    
    useEffect(() => {
      postData();
    }, [])
    return (
        <div>
              <div className="grid grid-cols-6 items-center justify-items-center gap-5">
        {posts.map((post, index) => (
      <img className="w-full h-20 border border-gray-400" src={post.flags.svg} key={index}/>
        ))}
      </div>
        </div>
    );
};

export default GetMethod;