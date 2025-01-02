import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
//const pdfUrl="https://frugal-gull-152.convex.cloud/api/storage/08983707-00b6-42b2-b9fa-6bb75fb8cd1f"
export async function GET(req){
    const reqUrl=req.url;
const {searchParams}= new URL(reqUrl);
const pdfUrl=searchParams.get('pdfUrl');
console.log(pdfUrl);
    //Loading the pdf file
    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs= await loader.load();
   let pdfTextContent='';
   docs.forEach(doc=>{
    pdfTextContent=pdfTextContent+doc.pageContent
   })

//splitting the text into smaller chunks
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:1000,
    chunkOverlap:20,

});
const output=await splitter.createDocuments([pdfTextContent]);
let splitterList=[]    
output.forEach(doc=>{
    splitterList.push(doc.pageContent);
});
return NextResponse.json({result:splitterList})
    
}