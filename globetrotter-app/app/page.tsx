import Image from "next/image";
import Hero from "./gt-components/hero";
import ParticleRing from "./gt-components/3dparticles";

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-y-scroll">
      <div className="w-full h-full flex place-items-center place-content-center">
        <Hero />
      </div>
    </main>
  );
}
