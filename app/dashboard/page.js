"use client"
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Link from 'next/link'
import React from 'react'

function Dashboard() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';

  const fileList = useQuery(api.fileStorage.GetUserFiles, { userEmail });

  if (!user) {
    return <div>Loading user information...</div>;
  }

  return (
    <div >
      <h2 className="font-bold text-3xl mb-5">WorkSpace</h2>
      <div className="flex flex-wrap gap-5 mt-10">
        {fileList && fileList.map((file, index) => (
          <Link href={'/workspace/'+file.fileId}>
          <div
            key={index}
            className="flex flex-col p-5 shadow-md rounded-md items-center justify-center border cursor-pointer hover:scale-105 transition-all w-48"
          >
            <img src={'/pdf.png'} alt="file" width={70} height={70} />
            <h3 className="mt-3 font-medium text-xl text-center">{file?.fileName}</h3>
           
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
