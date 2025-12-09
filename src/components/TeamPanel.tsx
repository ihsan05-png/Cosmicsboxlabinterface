import { motion } from 'motion/react';
import { Users, Mail, Github, Linkedin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  image: string;
  email: string;
  github?: string;
  linkedin?: string;
}

export function TeamPanel() {
  const team: TeamMember[] = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Lead Cryptographer',
      specialty: 'S-Box Design & Nonlinearity Analysis',
      image: 'https://images.unsplash.com/photo-1734092916915-d16146c0726c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY1MjU1ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      email: 'sarah.chen@cosmicsbox.lab',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    {
      name: 'Prof. Marcus Wright',
      role: 'Senior Researcher',
      specialty: 'Affine Transformation & AES Implementation',
      image: 'https://images.unsplash.com/photo-1758685734511-4f49ce9a382b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzY2llbnRpc3QlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjUyMzQ0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      email: 'marcus.wright@cosmicsbox.lab',
      github: 'https://github.com'
    },
    {
      name: 'Alex Rivera',
      role: 'Security Engineer',
      specialty: 'Differential Cryptanalysis & SAC Testing',
      image: 'https://images.unsplash.com/photo-1729109976830-e43699abd9b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZW5naW5lZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjUyNTU4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      email: 'alex.rivera@cosmicsbox.lab',
      linkedin: 'https://linkedin.com'
    },
    {
      name: 'Dr. Yuki Tanaka',
      role: 'Algorithm Specialist',
      specialty: 'Bijectivity Validation & Performance Optimization',
      image: 'https://images.unsplash.com/photo-1737575655055-e3967cbefd03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjUyMDMxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      email: 'yuki.tanaka@cosmicsbox.lab',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Users className="w-6 h-6 text-amber-400/70" />
          <h2 className="text-3xl tracking-[0.2em] text-slate-100">RESEARCH TEAM</h2>
        </div>
        <p className="text-slate-400/60 tracking-wide max-w-2xl mx-auto leading-relaxed">
          Meet the brilliant minds behind Cosmic S-Box Laboratory, dedicated to advancing 
          cryptographic research and security innovation.
        </p>
      </motion.div>

      {/* Team Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, index) => (
          <motion.div
            key={member.email}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            {/* Card */}
            <div className="relative bg-gradient-to-b from-slate-800/40 to-slate-900/40 rounded-xl overflow-hidden
              border border-slate-700/30 hover:border-amber-500/30 transition-all duration-500
              backdrop-blur-sm">
              
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-slate-900/50">
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-700 
                    group-hover:scale-110 group-hover:brightness-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60" />
                
                {/* Social Links Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-slate-900/90 
                  opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <motion.a
                    href={`mailto:${member.email}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-slate-800/80 border border-amber-500/30 
                      flex items-center justify-center hover:bg-amber-500/20 transition-all"
                  >
                    <Mail className="w-4 h-4 text-amber-400/80" />
                  </motion.a>
                  
                  {member.github && (
                    <motion.a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-500/30 
                        flex items-center justify-center hover:bg-slate-700/50 transition-all"
                    >
                      <Github className="w-4 h-4 text-slate-300" />
                    </motion.a>
                  )}
                  
                  {member.linkedin && (
                    <motion.a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-slate-800/80 border border-blue-500/30 
                        flex items-center justify-center hover:bg-blue-500/20 transition-all"
                    >
                      <Linkedin className="w-4 h-4 text-blue-400" />
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-lg text-slate-100 mb-1 tracking-wide">{member.name}</h3>
                <p className="text-xs text-amber-400/70 tracking-wider uppercase mb-3">{member.role}</p>
                <p className="text-sm text-slate-400/70 leading-relaxed">{member.specialty}</p>
              </div>

              {/* Accent Line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="inline-block bg-slate-800/30 border border-slate-700/30 rounded-lg px-8 py-5 backdrop-blur-sm">
          <p className="text-sm text-slate-400/70 leading-relaxed">
            <span className="text-amber-400/60">Interested in joining our research?</span>
            <br />
            Contact us at <a href="mailto:careers@cosmicsbox.lab" className="text-amber-400/80 hover:text-amber-300 transition-colors underline decoration-amber-500/30">careers@cosmicsbox.lab</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
