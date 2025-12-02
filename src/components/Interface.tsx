import { Section } from './Section'

export const Interface = () => {
    return (
        <div className="flex flex-col items-center w-full">
            <Section>
                <h1 className="text-6xl font-extrabold leading-snug">
                    <span className="bg-white text-black px-1 italic">Hello</span>, I'm
                    <br />
                    <span className="px-1 italic">Chris</span>
                </h1>
                <p className="text-lg text-gray-300 mt-4">
                    Cybersecurity Specialist & <br />
                    Full Stack Developer
                </p>
                <button className="bg-white text-black py-4 px-8 rounded-lg font-bold text-lg mt-16 hover:bg-gray-200 transition-colors">
                    Contact Me
                </button>
            </Section>
            <Section>
                <div className="flex flex-col items-end w-full">
                    <h2 className="text-4xl font-bold">Skills</h2>
                    <div className="mt-8 space-y-4">
                        <div className="bg-gray-900 p-4 rounded-lg w-64 border border-gray-800">
                            <h3 className="text-xl font-bold">Penetration Testing</h3>
                            <div className="w-full bg-gray-800 h-2 rounded-full mt-2">
                                <div className="bg-white h-2 rounded-full" style={{ width: '90%' }} />
                            </div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg w-64 border border-gray-800">
                            <h3 className="text-xl font-bold">Network Security</h3>
                            <div className="w-full bg-gray-800 h-2 rounded-full mt-2">
                                <div className="bg-white h-2 rounded-full" style={{ width: '85%' }} />
                            </div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg w-64 border border-gray-800">
                            <h3 className="text-xl font-bold">React / Three.js</h3>
                            <div className="w-full bg-gray-800 h-2 rounded-full mt-2">
                                <div className="bg-white h-2 rounded-full" style={{ width: '80%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
            <Section>
                <div className="flex flex-col w-full">
                    <h2 className="text-4xl font-bold">Projects</h2>
                    <div className="grid grid-cols-2 gap-8 mt-8">
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-white transition-colors">
                            <h3 className="text-2xl font-bold">SecureVault</h3>
                            <p className="text-gray-400 mt-2">Encrypted file storage system with zero-knowledge architecture.</p>
                        </div>
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-white transition-colors">
                            <h3 className="text-2xl font-bold">NetGuard</h3>
                            <p className="text-gray-400 mt-2">Real-time network traffic anomaly detection using AI.</p>
                        </div>
                    </div>
                </div>
            </Section>
            <Section>
                <div className="flex flex-col items-center justify-center w-full">
                    <h2 className="text-4xl font-bold">Contact</h2>
                    <div className="mt-8 p-8 bg-gray-900 rounded-lg border border-gray-800 w-96">
                        <form className="flex flex-col space-y-4">
                            <input type="text" placeholder="Name" className="bg-black border border-gray-700 p-3 rounded text-white focus:outline-none focus:border-white" />
                            <input type="email" placeholder="Email" className="bg-black border border-gray-700 p-3 rounded text-white focus:outline-none focus:border-white" />
                            <textarea placeholder="Message" rows={4} className="bg-black border border-gray-700 p-3 rounded text-white focus:outline-none focus:border-white" />
                            <button className="bg-white text-black py-3 rounded font-bold hover:bg-gray-200 transition-colors">Send Message</button>
                        </form>
                    </div>
                </div>
            </Section>
        </div>
    )
}
