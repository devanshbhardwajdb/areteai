'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Lottie from 'lottie-react';
import A1 from '@/anime3.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddClass = () => {
    const [loading, setLoading] = useState(false);
    const [questionsClass, setQuestionsClass] = useState('');
    const [scale, setScale] = useState('');
    const [intelligences, setIntelligences] = useState([]);
    const [intelligence, setIntelligence] = useState({ intelligenceType: "", questions: [] });
    const [newQuestion, setNewQuestion] = useState('');

    const { user } = useAuth();

    // Add a question to the intelligence object
    const addQuestion = () => {
        if (newQuestion.trim()) {
            setIntelligence(prev => ({
                ...prev,
                questions: [...prev.questions, newQuestion] // Add new question
            }));
            setNewQuestion(''); // Clear input after adding
        } else {
            toast.error('Question cannot be empty');
        }
    };

    // Add intelligence object to the intelligences array
    const addIntelligence = () => {
        if (intelligence.intelligenceType && intelligence.questions.length > 0) {
            setIntelligences(prev => [...prev, intelligence]); // Add intelligence
            setIntelligence({ intelligenceType: "", questions: [] }); // Reset after adding
        } else {
            toast.error('Please fill out the intelligence type and questions');
        }
    };

    // Submit the data to the API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Debugging: log intelligences to see if questions exist
        console.log('Submitting intelligences:', intelligences);

        if (intelligences.length === 0) {
            toast.error('Please add at least one intelligence');
            setLoading(false);
            return;
        }

        try {
            const dataToSave = {
                class: questionsClass,
                scale,
                intelligences,
            };

            // Save class and intelligences in the database
            const response = await fetch('/api/questions/addclasstest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSave),
            });

            if (response.ok) {
                toast.success('Class Added successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error saving class');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error submitting class');
        } finally {
            setLoading(false);
            setIntelligences([])
            setIntelligence({intelligenceType:"",questions:[]})
            setNewQuestion("")
            setScale()
        }
    };

    return (
        <div className='flex flex-col font-mont  items-start'>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss
                theme="dark"
            />
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 items-center w-full pt-5 md:p-8 p-2 duration-150 transition-all font-mont  backdrop-blur-md bg-black/60 "
            >
                <h3 className="text-white/90 text-2xl max-lg:text-xl font-bold mb-1">Add Particular Class</h3>

                <div className="flex mt-6 xl:gap-8 gap-2 w-full">
                    <div className="flex flex-col w-full">
                        <h3 className="text-white/90 text-lg font-medium mb-1">Select class:</h3>
                        <select
                            name="class"
                            value={questionsClass}
                            onChange={(e) => setQuestionsClass(e.target.value)}
                            className="bg-transparent rounded-lg p-2 w-full focus:outline-none focus:shadow-md border border-gray-600 focus:border-[#00a6a6] focus:shadow-[#00a6a6] text-white/90 placeholder-gray-400"
                            required
                        >
                            <option value="9" className='bg-black hover:bg-black/60'>9th Class</option>
                            <option value="10" className='bg-black'>10th Class</option>
                            <option value="11" className='bg-black'>11th Class</option>
                            <option value="12" className='bg-black'>12th Class</option>
                        </select>
                    </div>

                    <div className="flex flex-col w-full">
                        <h3 className="text-white/90 text-lg font-medium mb-1">Enter the scale</h3>
                        <input
                            value={scale}
                            onChange={(e) => setScale(e.target.value)}
                            type="number"
                            className="bg-transparent rounded-lg p-2 w-full focus:outline-none focus:shadow-md border border-gray-600 focus:border-[#00a6a6] focus:shadow-[#00a6a6] text-white placeholder-gray-400"
                            placeholder='Scale'
                            required
                        />
                    </div>
                </div>

                {/* Intelligence Input Section */}
                <div className="flex mt-6 xl:gap-8 gap-2 w-full">
                    <div className="flex flex-col w-full">
                        <h3 className="text-white/90 text-lg font-medium mb-1">Intelligence Type</h3>
                        <input
                            value={intelligence.intelligenceType}
                            onChange={(e) => setIntelligence({ ...intelligence, intelligenceType: e.target.value })}
                            type="text"
                            className="bg-transparent rounded-lg p-2 w-full focus:outline-none focus:shadow-md border border-gray-600 focus:border-[#00a6a6] focus:shadow-[#00a6a6] text-white placeholder-gray-400"
                            placeholder='Intelligence Type'
                        />
                    </div>

                    <div className="flex flex-col w-full">
                        <h3 className="text-white/90 text-lg font-medium mb-1">Add Questions</h3>
                        <div className="flex gap-2 items-center w-full ">
                            <input
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                type="text"
                                className="bg-transparent rounded-lg p-2 w-full focus:outline-none focus:shadow-md border border-gray-600 focus:border-[#00a6a6] focus:shadow-[#00a6a6] text-white placeholder-gray-400"
                                placeholder='Enter a question'
                            />
                            <button type="button" onClick={addQuestion} className=" bg-[#00a6a6] p-2 rounded text-black ">Add</button>
                        </div>
                    </div>
                </div>

                {/* Display Added Questions */}
                <ul className="text-white mt-2">
                    {intelligence.questions.map((q, index) => (
                        <li key={index}>{q}</li>
                    ))}
                </ul>

                {/* Add Intelligence Button */}
                <div className="flex flex-col mt-6 gap-8 w-full">
                    <button type="button" onClick={addIntelligence} className="bg-blue-500 text-white px-3 py-2 rounded mt-2">
                        Add Intelligence
                    </button>

                    {/* Display Added Intelligences */}
                    <ol className="text-white mt-4" type='1'>
                        {intelligences.map((intel, index) => (
                            <li key={index}>
                                <strong>{intel.intelligenceType}:</strong> {intel.questions.join(', ')}
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Save Button */}
                <button
                    className="nav-btn bg-[#00a6a6] text-black px-5 py-2 rounded-lg transition-all duration-150 hover:scale-95 hover:shadow-lg w-full flex justify-center items-center mt-5"
                    disabled={loading}
                >
                    {loading ? (
                        <Lottie animationData={A1} loop={true} className="w-6" />
                    ) : (
                        'Save'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddClass;
