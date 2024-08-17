import Image from "next/image";
import Hero from "./gt-components/hero";

export default function Home() {
  return (
    <main>
      <div className="w-screen h-screen flex place-items-center place-content-center">
        <Hero />
      </div>
    </main>
  );
}
