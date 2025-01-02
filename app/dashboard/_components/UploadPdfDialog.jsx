"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader2Icon, User } from 'lucide-react'
import uuid4 from 'uuid4';
import {useUser} from '@clerk/nextjs'
import axios from 'axios'


function UploadPdfDialog({children}) {

    const generateUploadUrl=useMutation(api.fileStorage.generateUploadUrl)
    const addFileEntry = useMutation(api.fileStorage.AddFileEntry)
    const [file,setFile]=useState();
    const embdeddDocument = useAction(api.myAction.ingest)
    const {user}= useUser();
    const [loading,setLoading] = useState(false);
    const [fileName,setFileName] = useState();
    const [open,setOpen]= useState(false);
    const getFileUrl=useMutation(api.fileStorage.getFileUrl);
    const OnFileSelect=(event)=>{
        setFile(event.target.files[0]);

    }
    const OnUpload=async()=>{

        setLoading(true);
         const postUrl = await generateUploadUrl();
         const result = await fetch(postUrl, {
            method: "POST",
             headers: { "Content-Type": file?.type },
             body: file,
          });
           const { storageId } = await result.json();
            console.log('StorageId:',storageId);
           const fileId= uuid4();
           const fileUrl=await getFileUrl({storageId:storageId})
           const resp= await addFileEntry({
              fileId:fileId,
              storageId:storageId,
              fileName: fileName??'Untitled file',
              fileUrl:fileUrl,
              createdBy:user?.primaryEmailAddress?.emailAddress
      
            })
            console.log(resp);

         // api cal to fetch pdf processed data
          const ApiResp = await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
          console.log(ApiResp.data.result);
          await embdeddDocument({
            splitText:ApiResp.data.result,
            fileId:fileId
          });
      
          setLoading(false);
          setOpen(false);
    }
  return (
    <Dialog open={open}>
  <DialogTrigger asChild>
    <Button onClick={()=>setOpen(true)} className='w-full'>Upload PDF File</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload Pdf file</DialogTitle>
      <DialogDescription asChild>
       <div>
       <h2 className='mt-5'>Select a file to upload</h2>
        <div className='flex mt-5 gap-2 p-3 rounded-md border'>
       
        <input type="file" accept='application/pdf' onChange={(event)=>OnFileSelect(event)} />
        </div>
        <div className='mt-2'>
            <label >File Name</label>
            <Input placeholder="File Name" onChange={(e)=>setFileName(e.target.value)} />

        </div>
        </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading}>
            {loading?
               <Loader2Icon className='animate-spin'/>:'Upload'
               }   </Button>
        </DialogFooter>
  </DialogContent>
</Dialog>

  )
}

export default UploadPdfDialog
