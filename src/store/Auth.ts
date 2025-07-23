import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config"; // client side

export interface UserPrefs {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null; // Models defines the type of objects returned by various proccesses
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;

  setHydrated(): void;
  verfiySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  // two parenthesis explained below
  persist(
    // persist(config, options)
    // immer((set) => (object)) this returns the object written inside () immediately

    // whatever written inside it can be accessed somewhere by {session} = useAuthStore
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },

      async verfiySession() {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch (error) {
          console.log(error);
        }
      },

      async login(email: string, password: string) {
        try {
          await account.deleteSession("current");
          const session = await account.createEmailPasswordSession(
            email,
            password
          );

          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(), // returns a user object
            account.createJWT(),
          ]);

          if (!user.prefs?.reputation)
            await account.updatePrefs<UserPrefs>({
              // account.updatePrefs<T>() now user.prefs is an object-> {reputation: 0}
              reputation: 0,
            });

          set({ session, user, jwt });

          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async createAccount(name: string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, jwt: null, user: null });
        } catch (error) {
          console.log(error);
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);

/* await verfiySession();
✔️ You can wait for the function to complete
✔️ But you cannot capture any return value because it resolves to void (nothing). 

function create<T>() {
  return function (initializer: StateCreator<T>): UseBoundStore<T> {
    // actual store creation
  };
}
✔️ First parenthesis: Passing the type.
✔️ Second parenthesis: Passing the store logic.

// Zustand persist pseudo-flow
hydrate()  // after the reload by zustand has been done then this runs. 
  .then(() => {
    if (onRehydrateStorage) {
      onRehydrateStorage()(getState(), undefined);
    }
  })
  .catch((error) => {
    if (onRehydrateStorage) {
      onRehydrateStorage()(undefined, error);
    }
  });
✔️ Zustand waits for the state to rehydrate (load from storage).
✔️ After hydration, it automatically triggers your onRehydrateStorage callback.

since config which is given inside persist is wrapped inside immer therefore we can use: immer((set) => {...})
set({ hydrated: true })
or 
set(state => {
  state.hydrated = true
})
both does the same job 
*/
