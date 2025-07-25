"use client";

import { ShimmerButton } from "./magicui/shimmer-button";
import RTE from "@/components/RTE";
import { Meteors } from "@/components/magicui/meteors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import slugify from "@/utils/slugify";
import { IconX } from "@tabler/icons-react";
import { Models, ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { databases, storage } from "@/models/client/config";
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { Confetti } from "@/components/magicui/confetti";

// React.ReactNode: children can be any valid React element(s), string, number, etc.
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4",
        className
      )}
    >
      <Meteors number={30} />
      {children}
    </div>
  );
};

/**
 * ******************************************************************************
 * ![INFO]: for buttons, refer to https://ui.aceternity.com/components/tailwindcss-buttons
 * ******************************************************************************
 */

// this model.document has system fields such as createdAt, updatedAt, id, collectionId, etc and also the fields which we made in the document
const QuestionForm = ({ question }: { question?: Models.Document }) => {
  const { user } = useAuthStore();
  const [tag, setTag] = React.useState("");
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    title: String(question?.title || ""),
    content: String(question?.content || ""),
    authorId: user?.$id,
    tags: new Set((question?.tags || []) as string[]), // Store unique tags. If the question exists → use its tags. If not → start with an empty list. Force TypeScript to treat this as a string array.
    attachment: null as File | null, // starting as null but can be file or null as well
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const loadConfetti = (timeInMS = 3000) => {
    const end = Date.now() + timeInMS; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      Confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      Confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const create = async () => {
    if (!formData.attachment) throw new Error("Please upload an image");

    // storage is from client side to allow only to manage storage of current user
    const storageResponse = await storage.createFile(
      questionAttachmentBucket,
      ID.unique(),
      formData.attachment
    );

    const response = await databases.createDocument(
      db,
      questionCollection,
      ID.unique(),
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags), //converts iterable to normal array(js)
        attachmentId: storageResponse.$id,
      }
    );

    loadConfetti();

    return response;
  };

  const update = async () => {
    if (!question) throw new Error("Please provide a question");

    const attachmentId = await (async () => {
      if (!formData.attachment) return question?.attachmentId as string;

      await storage.deleteFile(questionAttachmentBucket, question.attachmentId);

      const file = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment
      );

      return file.$id;
    })();

    const response = await databases.updateDocument(
      db,
      questionCollection,
      question.$id,
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId: attachmentId,
      }
    );

    return response;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // didn't check for attachment because it's optional in updating
    if (!formData.title || !formData.content || !formData.authorId) {
      setError(() => "Please fill out all fields");
      return;
    }

    setLoading(() => true);
    setError(() => "");

    try {
      const response = question ? await update() : await create();

      router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
    } catch (error: any) {
      setError(() => error.message);
    }

    setLoading(() => false);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      {error && (
        <LabelInputContainer>
          <div className="text-center">
            <span className="text-red-500">{error}</span>
          </div>
        </LabelInputContainer>
      )}
      <LabelInputContainer>
        <Label htmlFor="title">
          Title Address
          <br />
          <small>
            Be specific and imagine you&apos;re asking a question to another
            person.
          </small>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="content">
          What are the details of your problem?
          <br />
          <small>
            Introduce the problem and expand on what you put in the title.
            Minimum 20 characters.
          </small>
        </Label>
        <RTE
          value={formData.content}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, content: value || "" }))
          }
        />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="image">
          Image
          <br />
          <small>
            Add image to your question to make it more clear and easier to
            understand.
          </small>
        </Label>
        <Input
          id="image"
          name="image"
          accept="image/*"
          placeholder="click to insert image"
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            setFormData((prev) => ({
              ...prev,
              attachment: files[0], // taking only the single file
            }));
          }}
        />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="tag">
          Tags
          <br />
          <small>
            Add tags to describe what your question is about. Start typing to
            see suggestions.
          </small>
        </Label>
        <div className="flex w-full gap-4">
          <div className="w-full">
            <Input
              id="tag"
              name="tag"
              placeholder="e.g. (java c objective-c)"
              type="text"
              value={tag}
              onChange={(e) => setTag(() => e.target.value)}
            />
          </div>
          <button
            className="relative shrink-0 rounded-full border border-slate-600 bg-slate-700 px-8 py-2 text-sm transition duration-200 hover:shadow-2xl hover:shadow-white/[0.1]"
            type="button"
            onClick={() => {
              if (tag.length === 0) return;
              setFormData((prev) => ({
                ...prev,
                tags: new Set([...Array.from(prev.tags), tag]),
              }));
              setTag(() => "");
            }}
          >
            <div className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-2xl" />
            <span className="relative">Add</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from(formData.tags).map((tag, index) => (
            <div key={index} className="flex items-center">
              <div className="group relative inline-block rounded-full bg-slate-800 p-px text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10">
                  <span>{tag}</span>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        tags: new Set(
                          Array.from(prev.tags).filter((t) => t !== tag)
                        ),
                      }));
                    }}
                    type="button"
                  >
                    <IconX size={12} />
                  </button>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
              </div>
            </div>
          ))}
        </div>
      </LabelInputContainer>
      <ShimmerButton className="shadow-2xl" type="submit" disabled={loading}>
        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
          {question ? "Update" : "Publish"}
        </span>
      </ShimmerButton>
    </form>
  );
};

export default QuestionForm;

/*
<LabelInputContainer className="p-8">
  <h1>Hello</h1>    these are children prop and the className is passed as classname prop 
  <p>This is content.</p>
</LabelInputContainer>

From where does this user.$id come? 
User logs in ➜ authStore saves user ➜
useAuthStore gives access to user ➜
authorId: user?.$id stores that user ID in the form data.

// how zustand helps to get the currently logged in user: 
User logs in

You authenticate the user via Appwrite:
const session = await account.createEmailPasswordSession(email, password);
const user = await account.get();

Save user in Zustand store:
authStore.setState({ user });
Now the user is globally available.

Anywhere in your app:
const { user } = useAuthStore();
🔹 This gives you instant access to the logged-in user
🔹 No need to pass it down as props through all components.

WHY USE FORMDATA STATE AND NOT DIRECTLY QUESTION.CONTENT AND ALL? 

Immediately Invoked Async Function Expression (IIAFE). -> (async function() { ... })();
"Write a mini-async function → run it instantly → wait for the result → get the answer in one line."

HOW SLUGIFY WORKS:-
slugify("How to use Zustand in React") 
// returns "how-to-use-zustand-in-react"
It typically:
Converts all letters to lowercase.
Replaces spaces with hyphens.
Removes special characters.

RTE gives direct value in the event ....can use directly that to change content of formdata 

Server-Side Rendering Flow:
User ➜ Sends request to server ➜ Server fetches data ➜ Server builds HTML ➜ Browser displays it directly
Server-Side Rendering (SSR) means the server does all the work of building the page, not the browser. It’s super helpful for SEO and faster initial loading.

Client-Side Rendering Flow:
User ➜ Loads blank HTML page ➜ JS loads ➜ React builds the page in the browser ➜ Browser displays it

✔️ SSR gives you fast display (HTML), but without JavaScript, your page is not interactive.
✔️ Lazy loading reduces the amount of JavaScript that must load immediately, so your page becomes interactive faster.

What is Hydration?
After SSR sends the HTML → Next.js sends the JavaScript bundle to the browser.
The browser uses that JavaScript to make the page interactive.
This process is called hydration.

// e.target.files look like: FileList { 
  0: File { name: "photo1.png", size: 200000, type: "image/png" },
  1: File { name: "photo2.jpg", size: 180000, type: "image/jpeg" },
  length: 2
}

The accept attribute filters what types of files are shown in the file picker.

button glow effect :-
Class	                     Meaning
bg-gradient-to-r	Creates a gradient that flows from left to right.
from-transparent	Gradient starts with a transparent color.
via-teal-500	Gradient passes through teal-500 at the center.
to-transparent	Gradient ends with a transparent color on the right.

outer span covers the entire parent div by absolute inset-0 since: inset-0 is shorthand for top: 0;
right: 0;
bottom: 0;
left: 0;

*/
