import { FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 flex justify-between items-center text-sm text-gray-600">
      <div className="flex items-center flex-col space-y-4">
        <div>
          <span role="img" aria-label="fire" className="mr-2">🍳</span>
          <span className="font-semibold text-lg">Dish Dash Momzie.</span>
        </div>
        <span className="ml-2">© 2024 All rights reserved.</span>
      </div>
      <div className="flex flex-col justify-center space-y-4">
            <span className="text-gray-600 text-base">Created by Vansh Gulati</span>
            <div className='flex flex-row space-x-6 justify-center'>
              <SocialIcon href="https://twitter.com/kramjam" target="_blank" rel="noopener noreferrer" Icon={FaXTwitter} label="Twitter" />
              <SocialIcon href="https://www.linkedin.com/in/vanshgulati16/" target="_blank" rel="noopener noreferrer" Icon={FaLinkedin} label="Linkedin" />
              <SocialIcon href="https://github.com/vanshgulati16" target="_blank" rel="noopener noreferrer" Icon={FaGithub} label="Github" />
            </div>
        </div>
    </footer>
  );
}

function SocialIcon({ href, Icon, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-400 transition-colors">
      <Icon className="text-lg" />
      <span className="sr-only">{label}</span>
    </a>
  );
}