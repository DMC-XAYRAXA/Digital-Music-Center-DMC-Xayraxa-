/**
 * DMC XAYRAXA - OFFICIAL COPYRIGHT CERTIFICATE ENGINE
 * Delegates to the unified Classical Conservatory & Master Recording Certificate generator
 * featuring the official DMC R (ໄຊລາຊາ) Crest Logo.
 */

import { downloadDmcCertificateImage, CertificateTheme } from '../components/common/CopyrightCertificateModal';

export interface CertificateRenderOptions {
  memberId: string;
  memberName: string;
  isActiveLifetime: boolean;
  workTitle?: string;
  theme?: CertificateTheme;
}

export async function downloadCertificatePng(options: CertificateRenderOptions): Promise<void> {
  return downloadDmcCertificateImage(options);
}
