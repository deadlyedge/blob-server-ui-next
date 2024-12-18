import { GitBranchIcon, GithubIcon } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"

export const Footer = () => {
  return (
    <Drawer>
      <DrawerTrigger className='fixed right-1 bottom-1'>
        <GithubIcon />
      </DrawerTrigger>
      <DrawerContent className="p-4 flex items-center justify-center bg-zinc-600/80 backdrop-blur-md">
        <DrawerHeader>
          <DrawerTitle>About This Project</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 max-w-[50rem]">
            This is a simple UI for{" "}
            <a href='https://github.com/deadlyedge/pyBlobServer'>
              pyBlobServer: https://github.com/deadlyedge/pyBlobServer
              <GitBranchIcon className="inline" />
            </a>
            <br />
            This two project working together for just one goal: Make your VPS investment worthy.
            <br />
            As a hobby programer, I learn programing just for fun and buy a VPS just for show off, or at least at the beginning.  And then I found if I want to safe my files for some more show offs, I can't, I need to pay more for some blob services again.  So I'm very angry and I have to write something to get back my control.
            <br />
            And when I did, I found something fun from it.
            <br />
            So here we are.
        </div>
        <div className="px-4 pb-4 text-zinc-300 text-sm max-w-[40rem]">
          This project is not finished but very usable, just for some funciton not finished yet.  But I expect it will save your cost in the future but it's all depends on the project you want to host.
          <br />
          Still, you can consider this is public beta, have some fun!
          <br />
          During my coding works, AI did 80% works somehow, I just drink some coffee and do minor adjustments.  It's amazing.  Time's changed, 
          people can now do only thinking works, and left 80% for AI.  Pretty cool!

          <DrawerFooter>
            <DrawerClose>
              Enjoy!
            </DrawerClose>
          </DrawerFooter>
          
        </div>
      </DrawerContent>
    </Drawer>
  )
}
