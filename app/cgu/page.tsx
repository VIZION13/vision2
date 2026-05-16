"use client";

const C = {
  mint:"#6ECFAA", purple:"#B44FD4",
  bg:"#0D0D0F", surface:"#141418", card:"#1A1A22",
  border:"#2A2A36", text:"#F0EEF8", muted:"#7A7890",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:#2A2A36;border-radius:4px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
`;

const SECTIONS = [
  {
    title: "1. Objet et acceptation",
    content: [
      "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Vizion 2.0, accessible à l'adresse vizion2-nu.vercel.app et ses sous-domaines.",
      "Vizion 2.0 est une plateforme de streaming musical dédiée aux artistes en développement, leur permettant de diffuser leur musique, de recevoir des dons et de proposer des abonnements à leurs fans.",
      "En accédant à la plateforme, en créant un compte ou en utilisant l'un quelconque de nos services, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.",
      "Vizion 2.0 se réserve le droit de modifier ces CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur la plateforme. Il vous appartient de consulter régulièrement les CGU."
    ]
  },
  {
    title: "2. Description des services",
    content: [
      "Vizion 2.0 propose les services suivants :",
      "• Streaming musical : écoute gratuite et illimitée des titres publiés par les artistes inscrits sur la plateforme.",
      "• Espace artiste : création d'un profil, upload de titres musicaux, gestion de catalogue, accès aux statistiques d'écoute et de revenus.",
      "• Système de dons : les fans peuvent effectuer des dons libres à partir de 1 € directement aux artistes. Vizion 2.0 ne prélève aucune commission sur les dons.",
      "• Abonnements fans : les fans peuvent souscrire à des abonnements mensuels (plan Fan à 3 €, Super Fan à 7 €, VIP à 15 €) pour accéder à des contenus exclusifs. Vizion 2.0 prélève une commission de 10 % sur ces abonnements.",
      "• Dashboard artiste : suivi en temps réel des écoutes, des revenus, des abonnés et des transactions.",
      "Vizion 2.0 se réserve le droit de modifier, suspendre ou interrompre tout ou partie de ses services à tout moment, sans préavis ni indemnité."
    ]
  },
  {
    title: "3. Inscription et comptes utilisateurs",
    content: [
      "L'accès à certaines fonctionnalités de Vizion 2.0 nécessite la création d'un compte. L'inscription est gratuite et ouverte à toute personne physique majeure ou toute personne morale.",
      "Lors de l'inscription, vous vous engagez à fournir des informations exactes, complètes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion.",
      "Deux types de comptes sont disponibles :",
      "• Compte Fan : permet d'écouter de la musique, de suivre des artistes, d'effectuer des dons et de souscrire à des abonnements.",
      "• Compte Artiste : offre toutes les fonctionnalités du compte fan, plus la possibilité d'uploader des titres, de gérer un catalogue et de recevoir des paiements via Stripe Connect.",
      "Vizion 2.0 se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU, sans préavis ni indemnité."
    ]
  },
  {
    title: "4. Droits de propriété intellectuelle et licences musicales",
    content: [
      "4.1 — Garantie de l'artiste",
      "En uploadant un contenu musical sur Vizion 2.0, l'artiste déclare et garantit expressément :",
      "• Être le titulaire de l'intégralité des droits de propriété intellectuelle sur les œuvres uploadées (droits d'auteur, droits voisins, droits de producteur), ou disposer de toutes les autorisations nécessaires de la part des titulaires de droits.",
      "• Que l'upload et la diffusion de ses œuvres sur Vizion 2.0 ne constitue pas une violation des droits de tiers, notamment en matière de droit d'auteur, de droits voisins ou de droits de marque.",
      "• Que ses œuvres ne contiennent pas d'échantillons (samples) non autorisés ou de contenus protégés appartenant à des tiers sans avoir obtenu les autorisations nécessaires.",
      "4.2 — Licence accordée à Vizion 2.0",
      "En uploadant un contenu musical, l'artiste accorde à Vizion 2.0 une licence non exclusive, mondiale, gratuite, pour la durée de protection des droits d'auteur, afin de :",
      "• Diffuser, reproduire et mettre à disposition les œuvres sur la plateforme Vizion 2.0 et ses applications.",
      "• Créer des aperçus (previews) des œuvres à des fins promotionnelles.",
      "• Utiliser le nom et l'image de l'artiste dans le cadre de la promotion de la plateforme.",
      "Cette licence prend fin dès la suppression du contenu par l'artiste ou la résiliation de son compte.",
      "4.3 — Organismes de gestion collective",
      "Les artistes inscrits sur Vizion 2.0 restent seuls responsables de leurs obligations vis-à-vis des organismes de gestion collective (SACEM, SCPP, SPPF, ADAMI, SPEDIDAM ou équivalents internationaux). Vizion 2.0 n'assume pas la responsabilité du paiement des redevances dues à ces organismes au titre des œuvres diffusées.",
      "Vizion 2.0 s'engage à coopérer avec les organismes de gestion collective compétents et à déclarer les diffusions conformément aux obligations légales applicables.",
      "4.4 — Signalement de violations",
      "Toute personne estimant que son droit d'auteur est violé peut adresser une notification à : contact@vision2.music, conformément aux procédures applicables (DMCA, Directive droit d'auteur EU 2019/790)."
    ]
  },
  {
    title: "5. Règles de conduite et contenus interdits",
    content: [
      "Il est strictement interdit d'uploader ou de diffuser sur Vizion 2.0 :",
      "• Des œuvres dont vous ne détenez pas les droits ou pour lesquelles vous n'avez pas obtenu les autorisations nécessaires.",
      "• Des contenus portant atteinte aux droits de tiers : contrefaçon, plagiat, samples non autorisés.",
      "• Des contenus à caractère illicite : incitation à la haine, discrimination, violence, pornographie, contenus pédopornographiques.",
      "• Des contenus portant atteinte à la vie privée ou à l'image de tiers sans leur consentement.",
      "• Des contenus faisant la promotion d'activités illégales.",
      "• Des contenus trompeurs ou frauduleux.",
      "Vizion 2.0 se réserve le droit de supprimer tout contenu ne respectant pas ces règles, sans préavis, et de suspendre ou résilier le compte de l'utilisateur contrevenant."
    ]
  },
  {
    title: "6. Conditions financières et paiements",
    content: [
      "6.1 — Dons",
      "Les dons effectués par les fans sont reversés intégralement à l'artiste. Vizion 2.0 ne prélève aucune commission sur les dons. Les frais de traitement bancaire de Stripe (environ 1,4 % + 0,25 € par transaction pour les cartes européennes) sont à la charge de l'artiste.",
      "6.2 — Abonnements",
      "Vizion 2.0 prélève une commission de 10 % sur le montant des abonnements fans. Les 90 % restants sont reversés à l'artiste après déduction des frais bancaires Stripe.",
      "6.3 — Versements",
      "Les paiements sont traités via Stripe Connect. Pour recevoir des paiements, l'artiste doit compléter son inscription Stripe Connect et fournir les informations bancaires requises. Les versements sont effectués selon les conditions de Stripe, généralement sous 2 à 7 jours ouvrés.",
      "6.4 — Remboursements",
      "Les dons ne sont pas remboursables sauf en cas d'erreur manifeste ou de fraude avérée. Les abonnements peuvent être résiliés à tout moment, sans remboursement de la période en cours.",
      "6.5 — Fiscalité",
      "Chaque utilisateur est responsable de la déclaration et du paiement des impôts et taxes applicables aux revenus perçus via Vizion 2.0, conformément à la législation fiscale de son pays de résidence."
    ]
  },
  {
    title: "7. Protection des données personnelles (RGPD)",
    content: [
      "Vizion 2.0 collecte et traite vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD - UE 2016/679).",
      "7.1 — Données collectées",
      "• Données d'identification : nom, prénom, nom d'artiste, adresse email.",
      "• Données de profil : photo, biographie, genre musical, ville.",
      "• Données bancaires : traitées exclusivement par Stripe (Vizion 2.0 ne stocke aucune donnée bancaire).",
      "• Données d'usage : historique d'écoutes, interactions, statistiques.",
      "7.2 — Finalités du traitement",
      "• Gestion des comptes utilisateurs et authentification.",
      "• Fourniture et amélioration des services.",
      "• Traitement des paiements via Stripe.",
      "• Communication relative aux services (notifications, newsletters avec consentement).",
      "• Respect des obligations légales.",
      "7.3 — Vos droits",
      "Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement, opposition, portabilité et limitation du traitement. Pour exercer ces droits : contact@vision2.music.",
      "7.4 — Conservation des données",
      "Les données sont conservées pendant la durée d'utilisation du compte, puis 3 ans après la clôture du compte pour les obligations légales.",
      "7.5 — Sous-traitants",
      "Vizion 2.0 utilise les sous-traitants suivants : Supabase (hébergement des données, UE), Stripe (paiements), Vercel (hébergement de l'application, UE)."
    ]
  },
  {
    title: "8. Limitation de responsabilité",
    content: [
      "Vizion 2.0 est fourni 'en l'état', sans garantie d'aucune sorte, expresse ou implicite.",
      "Vizion 2.0 ne peut être tenu responsable :",
      "• Des contenus uploadés par les utilisateurs et de leur conformité aux droits de tiers.",
      "• Des interruptions de service, bugs ou pertes de données.",
      "• Des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser la plateforme.",
      "• Des litiges entre utilisateurs (artistes et fans).",
      "• Des décisions des organismes de gestion collective concernant les droits des œuvres diffusées.",
      "La responsabilité de Vizion 2.0 est limitée au montant des sommes versées par l'utilisateur au cours des 12 derniers mois."
    ]
  },
  {
    title: "9. Résiliation",
    content: [
      "Vous pouvez résilier votre compte à tout moment en contactant contact@vision2.music ou via les paramètres de votre compte.",
      "En cas de résiliation :",
      "• Vos contenus musicaux seront supprimés de la plateforme dans un délai de 30 jours.",
      "• Les abonnements en cours seront annulés à leur prochaine date de renouvellement.",
      "• Les revenus disponibles vous seront versés selon les conditions Stripe.",
      "• Vos données personnelles seront conservées conformément à notre politique de confidentialité.",
      "Vizion 2.0 peut résilier votre compte en cas de violation des présentes CGU, avec ou sans préavis selon la gravité de la violation."
    ]
  },
  {
    title: "10. Droit applicable et juridiction",
    content: [
      "Les présentes CGU sont soumises au droit français.",
      "En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGU, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire.",
      "À défaut d'accord amiable, les tribunaux français seront seuls compétents.",
      "Pour tout litige de consommation, vous pouvez recourir à la médiation de la consommation conformément aux articles L.616-1 et R.616-1 du Code de la consommation.",
      "Contact : contact@vision2.music"
    ]
  }
];

export default function CGUPage() {
  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",padding:"0 0 80px"}}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"20px 48px",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(16px)"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${C.mint},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:13,color:"#fff"}}>V</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15}}>VIZION <span style={{color:C.mint}}>2.0</span></span>
          </div>
          <a href="/" style={{fontSize:13,color:C.muted,textDecoration:"none",padding:"7px 14px",borderRadius:9,border:`1px solid ${C.border}`,transition:"color .2s"}}
            onMouseEnter={e=>(e.currentTarget.style.color=C.mint)}
            onMouseLeave={e=>(e.currentTarget.style.color=C.muted)}>
            ← Retour
          </a>
        </div>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"48px 24px",animation:"fadeUp .4s ease both"}}>

        {/* Title */}
        <div style={{marginBottom:48,paddingBottom:32,borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:12,color:C.mint,letterSpacing:2,textTransform:"uppercase",fontWeight:700,marginBottom:12}}>Légal</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:"clamp(28px,4vw,42px)",marginBottom:16}}>
            Conditions Générales d&apos;Utilisation
          </h1>
          <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
            <span style={{fontSize:13,color:C.muted}}>📅 Version du 14 mai 2025</span>
            <span style={{fontSize:13,color:C.muted}}>🇫🇷 Droit français applicable</span>
            <span style={{fontSize:13,color:C.muted}}>✉️ contact@vision2.music</span>
          </div>
        </div>

        {/* Intro box */}
        <div style={{padding:"20px 24px",borderRadius:16,background:`${C.mint}08`,border:`1px solid ${C.mint}33`,marginBottom:48}}>
          <div style={{fontWeight:700,fontSize:15,color:C.mint,marginBottom:8}}>📋 Résumé en langage simple</div>
          <div style={{fontSize:13,color:C.muted,lineHeight:1.8}}>
            • Tu uploades ta propre musique → tu gardes 100% de tes droits<br/>
            • Les dons → 100% pour toi, 0% pour nous<br/>
            • Les abonnements → 90% pour toi, 10% pour Vizion 2.0<br/>
            • Tes données → stockées en Europe, jamais vendues<br/>
            • Tu peux supprimer ton compte à tout moment
          </div>
        </div>

        {/* Table of contents */}
        <div style={{padding:"20px 24px",borderRadius:16,background:C.card,border:`1px solid ${C.border}`,marginBottom:48}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Table des matières</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {SECTIONS.map((s,i)=>(
              <a key={i} href={`#section-${i}`} style={{fontSize:13,color:C.muted,textDecoration:"none",display:"flex",alignItems:"center",gap:8,transition:"color .2s"}}
                onMouseEnter={e=>(e.currentTarget.style.color=C.mint)}
                onMouseLeave={e=>(e.currentTarget.style.color=C.muted)}>
                <span style={{color:C.mint,fontWeight:700,minWidth:20}}>{i+1}.</span>
                {s.title.replace(/^\d+\.\s/,"")}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{display:"flex",flexDirection:"column",gap:40}}>
          {SECTIONS.map((section,i)=>(
            <div key={i} id={`section-${i}`} style={{paddingTop:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{width:3,height:20,borderRadius:2,background:`linear-gradient(to bottom,${C.mint},${C.purple})`,flexShrink:0}}/>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(16px,2vw,20px)",color:C.text}}>{section.title}</h2>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12,paddingLeft:13}}>
                {section.content.map((para,j)=>(
                  <p key={j} style={{
                    fontSize:14,
                    lineHeight:1.8,
                    color: para.startsWith("•") ? C.muted : para.match(/^\d+\.\d+/) ? C.mint : C.muted,
                    fontWeight: para.match(/^\d+\.\d+/) ? 600 : 400,
                    paddingLeft: para.startsWith("•") ? 12 : 0,
                    borderLeft: para.startsWith("•") ? `2px solid ${C.border}` : "none",
                  }}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{marginTop:64,paddingTop:32,borderTop:`1px solid ${C.border}`,textAlign:"center"}}>
          <div style={{fontSize:13,color:C.muted,marginBottom:16}}>
            Pour toute question relative à ces CGU, contactez-nous à
          </div>
          <a href="mailto:contact@vision2.music" style={{fontSize:15,fontWeight:700,color:C.mint,textDecoration:"none"}}>
            contact@vision2.music
          </a>
          <div style={{marginTop:24,display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/" style={{fontSize:13,color:C.muted,textDecoration:"none",padding:"8px 16px",borderRadius:10,border:`1px solid ${C.border}`}}>
              ← Retour à l&apos;accueil
            </a>
            <a href="/auth" style={{fontSize:13,color:C.mint,textDecoration:"none",padding:"8px 16px",borderRadius:10,border:`1px solid ${C.mint}44`,background:`${C.mint}10`}}>
              Créer mon compte →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
