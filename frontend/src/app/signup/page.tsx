'use client'

import { useState } from 'react'
import { PersonalData } from '@/types/ColorContractTypes'
import { usePolkadot } from "@/contexts/PolkadotContext";
import { useApi } from "@/contexts/ApiContext";
import { signUp } from '@/services/colorTheInternetService';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
    const router = useRouter();
    const { selectedAccount } = usePolkadot();
    const { api, isReady } = useApi();
    const [formData, setFormData] = useState<PersonalData>({
        realName: '',
        job: '',
        xAccount: '',
        blueSkyAccount: '',
        emailAccount: ''
      })
      const [loading, setLoading] = useState(false)
      const [message, setMessage] = useState('')

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
      }
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        if (!isReady){
          alert("API is not ready.");
          setLoading(false);
          return;
        }
        if (selectedAccount != null){
          signUp(api, selectedAccount, formData);
          setLoading(false);
          setMessage("Sign up is completed.");
          router.push('/xxx');
        }else {
          alert("Account is not selected.");
          setLoading(false);
          return;
        }
      }

      return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl mx-auto mt-10 space-y-4">
          <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
          {['realName', 'job', 'xAccount', 'blueSkyAccount', 'emailAccount'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize text-gray-700">{field}</label>
              <input
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          ))}
    
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {message && <p className="text-center mt-2 text-sm text-gray-600">{message}</p>}
        </form>
      )
    }