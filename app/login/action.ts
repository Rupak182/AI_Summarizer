'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  console.log("data",data)
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log("Error:",error)
    redirect('/error')
  }

  revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
  }


  export async function login_OAuth(){
    const supabase = await createClient()
  
    const { error ,data} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options:{
        redirectTo:`http://localhost:3000/auth/callback`
      }
    })

    if (data.url) {
      redirect(data.url) // use the redirect API for your server framework
    }
    console.log("data",data)
    if (error) {
      console.log("Error:",error)
      redirect('/error')
    }
  
  }
  
  
  