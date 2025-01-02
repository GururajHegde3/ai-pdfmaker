import React from 'react'
import { Bold, Sparkles, Underline } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import { chatSession } from '@/configs/AIModel'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'

function EditorExtension({ editor}) {

  const {fileId}=useParams();
  
  const SearchAI=useAction(api.myAction.search)
  const saveNotes=useMutation(api.notes.AddNotes)
  const {user}=useUser();
 
  const onAiClick=async()=>{
    toast("AI is fetching your answer")


  const SelectedText=editor.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to,
    ' '
  );
  console.log("selected text:",SelectedText)
  const result=await SearchAI({
    query:SelectedText,
    fileId:fileId

  })
  console.log("unformatted result:",result);
  const UnformattedAns=JSON.parse(result);
  let AllUnformatedAns='';
  UnformattedAns&&UnformattedAns.forEach(item=>{
    AllUnformatedAns=AllUnformatedAns+item.pageContent

  });
  const PROMPT="for question:"+SelectedText+"and with the given content as answer,"+
  "please give appropriate answer in HTML format.the answer content is :" +   AllUnformatedAns;
  const AiModelResult=await chatSession.sendMessage(PROMPT);
  console.log(AiModelResult.response.text());
  const FinalAns=AiModelResult.response.text().replace('```','').replace('html','').replace('```','');

  const AllText = editor.getHTML();
  editor.commands.setContent(AllText+'<p> <strong> Answer: </strong>'+FinalAns+ '</p>')
saveNotes({
  notes:editor.getHTML(),
  fileId:fileId,
  createdBy:user?.primaryEmailAddress?.emailAddress
})
 }
  return (
    <div className="p-5">
      <div className="control-group">
        <div className="button-group  flex gap-3">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'text-blue-500' : ''}
          >
            <Bold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'is-active' : ''}
          >
            <Underline/>
          </button>
          <button
            onClick={() => onAiClick()}
            className={'hover:text-blue-500'}
          >
            <Sparkles/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditorExtension
