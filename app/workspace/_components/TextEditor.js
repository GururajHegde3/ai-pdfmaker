import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import React, { useEffect } from 'react'
import Bold from '@tiptap/extension-bold' 
import EditorExtension from './EditorExtension'
import Underline from '@tiptap/extension-underline'
import { useQueries, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

function TextEditor({fileId}) {
    const notes=useQuery(api.notes.GetNotes,{
        fileId:fileId
    })
    const editor = useEditor({
        extensions: [StarterKit,Underline,
            Placeholder.configure({
                placeholder:'Start Taking your notes here..'
            })
        ],
      
        editorProps:{
            attributes:{
                class:'focus:outline-none h-screen p-5'
            }
        }
      })
      useEffect(()=>{
       editor&&editor.commands.setContent(notes)
      },[notes&&editor])
      if (!editor) return null 
  return (
    <div>
        <EditorExtension editor={editor}/>
    <div className='overflow-scroll h-[88vh]'>
    <EditorContent editor={editor} />
    </div>
    </div>
  )
}

export default TextEditor
