import LoaderRoot from "./Loader.svelte";
import LoaderEmpty from "./LoaderEmpty.svelte";
import LoaderError from "./LoaderError.svelte";
import LoaderLoading from "./LoaderLoading.svelte";
import LoaderMessage from "./LoaderMessage.svelte";
import LoaderSuccess from "./LoaderSuccess.svelte";

export const Loader = { Root: LoaderRoot, Empty: LoaderEmpty, Error: LoaderError, Loading: LoaderLoading, Message: LoaderMessage, Success: LoaderSuccess };
