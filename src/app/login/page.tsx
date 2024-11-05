'use client'

import { toast } from 'react-toastify';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/y71wwxpKfsO
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget)
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });
    const res = (await response.json());
    if (response.ok) {
      router.push('/admin')
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <Image alt="Logo" src="/logo.jpg" width={100} height={100} />
          <h2 className="text-2xl font-bold">Cheap Finds</h2>
          <h3 className="text-1xl font-bold">Point of sale</h3>
          <p className="text-muted-foreground">
            Enter your email and password to sign in.
          </p>
        </div>
        <Card>
          <form onSubmit={submitForm}>
            <CardContent className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email"  type="email" placeholder="name@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password"  type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {/*<Link
                href="#"
                className="text-sm text-muted-foreground"
                prefetch={false}
              >
                Forgot password?
              </Link>*/}
              <Button type="submit">Log in</Button>
              {/*<Button formAction={signup}>Sign up</Button>*/}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
