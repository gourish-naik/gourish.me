import { useState, FormEvent } from 'react';
import validator from 'validator';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface ResumeDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeDownloadModal({ isOpen, onClose }: ResumeDownloadModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required.');
      return;
    }

    if (!validator.isEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Close the modal immediately after client-side validation passes
    onClose();

    const promise = fetch('/api/download-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong.');
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: 'Sending email...',
      success: () => {
        setName('');
        setEmail('');
        return 'Email sent successfully! Check your inbox.';
      },
      error: (err) => err.message || 'Failed to send email.',
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Download Resume</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times;</button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full mt-6">
            Get Resume by Mail
          </Button>
        </form>
      </div>
    </div>
  );
}
