import {useThemeStore} from "../store/useThemeStore.ts";
import {Themes} from "../constants";
import {useAuthStore} from "../store/useAuthStore.ts";
import {useState} from "react";
import toast from "react-hot-toast";
import {Loader2, Pencil} from "lucide-react"

const SettingsPage = () => {
    const {theme,setTheme} = useThemeStore()
    const [fullName,setFullName] = useState<string>("");
    const {updateFullName,isFullNameLoading} = useAuthStore()

    const handleUpdateFullName = async ()=>{
        try{
            updateFullName(fullName);
            setFullName("");
            toast.success("Full name updated successfully.");
        }catch (e) {
            console.error(e);
            toast.error("couldn't update full name");
        }
    }

    return (
        <div className="pt-24">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col gap-1 items-center mb-5">
                <h2 className="text-lg font-semibold">Theme</h2>
                <p className="text-sm text-base-content/70">Set A theme for your application interface:</p>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {Themes.map((t:string) => (
                    <button
                        key={t}
                        className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
                        onClick={() => setTheme(t)}
                    >
                        <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                            <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                                <div className="rounded bg-primary"></div>
                                <div className="rounded bg-secondary"></div>
                                <div className="rounded bg-accent"></div>
                                <div className="rounded bg-neutral"></div>
                            </div>
                        </div>
                        <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
                    </button>
                ))}
            </div>

            <h1 className="mt-6">Edit Your FullName:</h1>
              <div className="flex items-center mt-3">
                <input
                    type="text"
                    className="w-full input input-bordered rounded-lg input-sm sm:input-md flex-1"
                    placeholder="Enter New Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)} />
                  <button disabled={isFullNameLoading} className="btn btn-circle ml-3" onClick={handleUpdateFullName}>
                      { isFullNameLoading ?
                          <>
                              <Loader2 size={20} className="animate-spin"/>
                          </> :
                          <Pencil size={20}/>
                      }
                  </button>

              </div>
        </div>
        </div>
    );
};

export default SettingsPage;