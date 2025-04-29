import MailchimpSignup from "@/components/mailchimp-signup"

interface ResultsCtaProps {
  profileType: string
}

export default function ResultsCta({ profileType }: ResultsCtaProps) {
  // Remove the Card wrapper since the parent component already has a Card
  return <MailchimpSignup profileType={profileType} />
}
