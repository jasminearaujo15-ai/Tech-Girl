import { redirect } from 'next/navigation';
import { learningViewer } from './learning/access';
import { chatGPTSignInPath } from './chatgpt-auth';
import Workspace from './workspace';
export const dynamic='force-dynamic';
export default async function Home(){const {user,admin}=await learningViewer();if(!user)redirect(chatGPTSignInPath('/'));if(!admin)redirect('/courses');return <Workspace/>;}
