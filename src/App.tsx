import React, { useState } from 'react';
import { Music, Sparkles, Users, ArrowRight } from 'lucide-react';
import Header from './components/Header';
import AudioUploader from './components/AudioUploader';
import StemsViewer from './components/StemsViewer';
import BeatGeneratorForm from './components/BeatGeneratorForm';
import CommunityHub from './components/CommunityHub';
import AudioPlayer from './components/AudioPlayer';
import UserProfile from './components/UserProfile';
import AuthModal from './components/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingIndicator from './components/LoadingIndicator';
import { UserProvider, useUser } from './contexts/UserContext';
import { ErrorProvider } from './contexts/ErrorContext';
import { useAuth } from './hooks/useAuth';
import { useAudioProcessing } from './hooks/useAudioProcessing';

type AppSection = 'home' | 'create' | 'community';

function AppContent() {
  const [currentSection, setCurrentSection] = useState<AppSection>('home');
  const { authModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const {
    isProcessingStems,
    isGeneratingBeat,
    stems,
    generatedBeat,
    error,
    progress,
    processStemSeparation,
    processBeatGeneration,
  } = useAudioProcessing();

  const handleStemsGenerated = async (audioFile: File) => {
    const newStems = await processStemSeparation(audioFile);
    return newStems;
  };

  const handleBeatGenerated = async (params: any) => {
    const beatUrl = await processBeatGeneration(params);
    return beatUrl;
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'create':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Create Your Remix
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Upload a song to separate stems with AI, then generate new beats to create your unique remix
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column - Upload & Beat Generator */}
              <div className="space-y-6">
                <ErrorBoundary>
                  <AudioUploader 
                    onStemsGenerated={handleStemsGenerated}
                    variant="withProgress"
                  />
                </ErrorBoundary>
                
                <ErrorBoundary>
                  <BeatGeneratorForm 
                    onBeatGenerated={handleBeatGenerated}
                    variant="parameterControls"
                  />
                </ErrorBoundary>
              </div>

              {/* Right Column - Stems Viewer */}
              <div className="space-y-6">
                <ErrorBoundary>
                  {isProcessingStems && (
                    <LoadingIndicator message="Processing audio..." />
                  )}
                  
                  {stems.length > 0 && (
                    <StemsViewer 
                      stems={stems}
                      variant="download"
                    />
                  )}
                  
                  {stems.length === 0 && !isProcessingStems && (
                    <div className="glass-card rounded-lg p-8 text-center">
                      <Music className="w-12 h-12 text-white/50 mx-auto mb-4" />
                      <p className="text-white/60">
                        Upload an audio file to get started with stem separation
                      </p>
                    </div>
                  )}
                </ErrorBoundary>
                
                <ErrorBoundary>
                  {generatedBeat && (
                    <div className="glass-card rounded-lg p-4 space-y-3">
                      <h3 className="text-white font-medium">Generated Beat</h3>
                      <AudioPlayer 
                        audioUrl={generatedBeat}
                        variant="standard"
                      />
                    </div>
                  )}
                </ErrorBoundary>
              </div>
            </div>
          </div>
        );

      case 'community':
        return (
          <ErrorBoundary>
            <CommunityHub />
          </ErrorBoundary>
        );

      default:
        return (
          <div className="space-y-12 sm:space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                  Beat Weaver
                </h1>
                <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">
                  Craft and share AI-enhanced music remixes effortlessly
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setCurrentSection('create')}
                  className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Start Creating</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setCurrentSection('community')}
                  className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  <Users className="w-5 h-5" />
                  <span>Explore Community</span>
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="glass-card rounded-lg p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">AI Stem Separator</h3>
                <p className="text-white/70 text-sm">
                  Upload any song and let AI separate it into individual stems - vocals, drums, bass, and more
                </p>
              </div>

              <div className="glass-card rounded-lg p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">AI Beat Builder</h3>
                <p className="text-white/70 text-sm">
                  Generate original drum patterns and basslines with AI based on your preferred genre and style
                </p>
              </div>

              <div className="glass-card rounded-lg p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Community & Tips</h3>
                <p className="text-white/70 text-sm">
                  Share your remixes with the community and receive direct support through crypto tips
                </p>
              </div>
            </div>

            {/* Demo Preview */}
            <div className="glass-card rounded-lg p-6 sm:p-8">
              <div className="text-center space-y-4 mb-6">
                <h3 className="text-2xl font-bold text-white">See It In Action</h3>
                <p className="text-white/70">
                  Experience the power of AI-driven music creation
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Original Track</h4>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="waveform w-full h-12 opacity-60" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-white font-medium">AI Generated Remix</h4>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="waveform w-full h-12 opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      {/* Navigation */}
      <nav className="w-full bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'home', label: 'Home', icon: Music },
              { id: 'create', label: 'Create', icon: Sparkles },
              { id: 'community', label: 'Community', icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentSection(id as AppSection)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  currentSection === id
                    ? 'border-primary-500 text-white'
                    : 'border-transparent text-white/70 hover:text-white/90'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {renderContent()}
      </main>
      
      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
    </div>
  );
}

function App() {
  return (
    <ErrorProvider>
      <UserProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </UserProvider>
    </ErrorProvider>
  );
}

export default App;

