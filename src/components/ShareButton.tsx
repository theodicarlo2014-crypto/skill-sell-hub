import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ShareButton = () => {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://skillswaped.lovable.app';
  const shareText = 'Check out SkillSwap — hire local skills or get paid for yours!';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SkillSwap', text: shareText, url: shareUrl });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-sm text-sm hover:bg-muted transition-all"
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      {copied ? 'Copied!' : 'Invite Friends'}
    </button>
  );
};

export default ShareButton;
