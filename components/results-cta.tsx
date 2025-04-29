import MailchimpSignup from "@/components/mailchimp-signup"

interface ResultsCtaProps {
  profileType: string
  language: "en" | "zh-TW"
}

export default function ResultsCta({ profileType, language }: ResultsCtaProps) {
  // Remove the Card wrapper since the parent component already has a Card
  return <MailchimpSignup profileType={profileType} language={language} />
}
