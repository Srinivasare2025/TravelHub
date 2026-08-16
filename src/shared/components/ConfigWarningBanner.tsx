import * as React from 'react';
import { MessageBar, MessageBarType, Link } from '@fluentui/react';
import { IConfigValidationResult } from '../../models';

export interface IConfigWarningBannerProps {
  configWarning: IConfigValidationResult;
  /**
   * Admin web part passes this to deep-link straight to the Settings section
   * of the same app instance; the public web part omits it since Settings
   * lives in a separate web part (Travel Hub Admin), possibly on another page.
   */
  onGoToSettings?: () => void;
}

/**
 * Surfaces the "dependency configuration missing" case from ServiceContext's
 * configWarning: the TravelHubConfig list and/or one or more content lists
 * weren't found at the resolved site. Tells the admin exactly what's wrong
 * and what to do about it (check the Site URL, then provision the lists)
 * instead of the app silently rendering empty sections.
 */
export const ConfigWarningBanner: React.FC<IConfigWarningBannerProps> = ({ configWarning, onGoToSettings }) => {
  const { siteUrl, configListFound, missingLists } = configWarning;

  return (
    <MessageBar messageBarType={MessageBarType.warning} isMultiline>
      <strong>Travel Hub isn&rsquo;t fully configured yet.</strong> Currently using site: <code>{siteUrl}</code>
      <ul style={{ margin: '6px 0', paddingLeft: 20 }}>
        {!configListFound && (
          <li>The <code>TravelHubConfig</code> list wasn&rsquo;t found at this site — default settings are being used.</li>
        )}
        {missingLists.length > 0 && (
          <li>These lists are missing at this site: <code>{missingLists.join(', ')}</code></li>
        )}
      </ul>
      To fix this: confirm the <strong>Site URL</strong> is correct
      {onGoToSettings ? (
        <> in <Link onClick={onGoToSettings}>Settings</Link></>
      ) : (
        <> in the Travel Hub Admin web part &rarr; Settings</>
      )}
      , then create the missing list(s) there — run <code>provisioning/Create-TravelHubLists-SPO.ps1</code> against
      that site, or create them manually per <code>provisioning/TravelHub-Schema.md</code>.
    </MessageBar>
  );
};
