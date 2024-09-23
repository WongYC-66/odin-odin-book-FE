'use client'

import { useState, useEffect } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

import API_URL from '../../lib/apiUrl.js'

export default function ModalNewPost(props) {

  const open = props.open
  const setOpen = props.setOpen
  const setIsLoading = props.setIsLoading

  const [username, setUsername] = useState('')
  const [photoURL, setPhotoURL] = useState('/user2.png')

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('user'))
    if(!data) return
    const { username, photoURL } = data
    setUsername(username)
    setPhotoURL(photoURL || '/user2.png')
  }, [])

  const handleNewPostSubmit = async (e) => {
    e.preventDefault()

    const sendRequest = async () => {
      const { token } = JSON.parse(localStorage.getItem('user'))

      const formData = new FormData(e.target);
      const objectData = Object.fromEntries(formData.entries());

      const response = await fetch(`${API_URL}/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Attach the Bearer token
        },
        body: JSON.stringify(objectData),
      });

      let { error } = await response.json()

      // if error show error message
      if (error) {
        console.error(error)
        alert("Ooops, something went wrong, try again")
        return
      }
      // passed
      if (setIsLoading)
        setIsLoading(true) // partially refresh by fetch at root url if triggers from home screen
      else
        window.location.reload() // full refresh if triggers from nav bar (left/bottom)
    }

    sendRequest()

    setOpen(false)
    console.log("submitted!")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white">

        <DialogHeader>
          <DialogTitle className='text-center'>New Thread</DialogTitle>
          <DialogDescription>
            {/* {`Make changes to your profile here. Click save when you're done.`} */}
          </DialogDescription>
        </DialogHeader>

        <div className="flex">
          {/* User Photo */}
          <div className='relative flex items-start h-min-0'>
            <Image alt='photo' src={photoURL} width={50} height={50} />
          </div>

          <div className='w-full ms-3 flex flex-col justify-between'>

            {/* User's username */}
            <div className='min-h-4'>
              <span className=' font-bold hover:underline'> {username}</span>
            </div>

            {/* post's content */}
            <form id="newPost" onSubmit={handleNewPostSubmit}>
              <Textarea placeholder="Type your message here." id="postContent" name="content" required />
            </form>

          </div>
        </div>

        <DialogFooter>
          <Button type="submit" form="newPost">Post</Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
