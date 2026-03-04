import { Lightbulb, Wrench, Plug, Rocket } from 'lucide-react';

const steps = [
    {
        icon: Lightbulb,
        step: '01',
        title: 'Share Your Workflow Pains',
        desc: 'Tell us where leads leak, where CRM chaos lives, or where your team is drowning in repetitive tasks.',
    },
    {
        icon: Wrench,
        step: '02',
        title: 'We Build Your Custom Agent',
        desc: 'Using our proprietary engine, we design and train a lifelike AI agent loaded with your exact Knowledge Bank—zero hallucinations.',
    },
    {
        icon: Plug,
        step: '03',
        title: 'Integrate Seamlessly',
        desc: 'Deploy via a single iframe, SDK snippet, or connect through webhooks to Zapier, Salesforce, HubSpot, and more.',
    },
    {
        icon: Rocket,
        step: '04',
        title: 'Deploy & Monitor',
        desc: 'Go live instantly. Track lead scores, conversation analytics, and ROI through real-time dashboards and email alerts.',
    },
];

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="bg-zinc-950 py-24 px-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">How It Works</p>
                    <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                        From Pain Point to Production in Days, Not Months
                    </h2>
                    <p className="text-zinc-400 text-base max-w-2xl mx-auto">
                        We handle the complexity. You get a battle-ready AI agent deployed on your website, embedded in your CRM, or fielding calls—fast.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map(({ icon: Icon, step, title, desc }) => (
                        <div
                            key={step}
                            className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors group"
                        >
                            <span className="absolute top-4 right-5 text-4xl font-black text-zinc-800 group-hover:text-indigo-500/20 transition-colors select-none">
                                {step}
                            </span>
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                                <Icon size={20} className="text-indigo-400" />
                            </div>
                            <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
