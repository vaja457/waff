/**
 * WAFF Menu Data & Admin Storage Manager
 */
const WAFF_STORAGE_KEYS = {
  MENU: 'waff_menu_items_v2',
  PASS: 'waff_admin_pass_v2',
  AUTH: 'waff_admin_auth_v2'
};

const DEFAULT_MENU_ITEMS = [
  {
    "id": "waffle-1",
    "category": "ვაფლები",
    "title": "ბელგიური კლასიკა",
    "price": "₾ 14.90",
    "image": "images/thumb-1.jpg",
    "rating": "5.0",
    "badge": "★ 4.9 • საფირმო",
    "shortDesc": "ახალი მარწყვით, მოცვით, ნეკერჩხლის სიროფითა და ნაზი ბელგიური ნაღებით.",
    "detailedDesc": "ჩვენი ლეგენდარული საფირმო ბელგიური ვაფლი. ცხვება ტრადიციული ლიეჟური რეცეპტით, გარედან საოცრად ხრაშუნა და შიგნიდან ფუმფულა. ზემოდან ემატება მინდვრის ახალი მარწყვი, ველური მოცვი, 100% ორგანული კანადური ნეკერჩხლის სიროფი და ცივი, ნაზი ათქვეფილი ნაღები.",
    "featuredHome": true,
    "heroImage": "images/waffle-hero-1.png"
  },
  {
    "id": "waffle-2",
    "category": "ვაფლები",
    "title": "შოკოლადის ვულკანი",
    "price": "₾ 16.50",
    "image": "images/thumb-2.jpg",
    "rating": "5.0",
    "badge": "★ 5.0 • ბესტსელერი",
    "shortDesc": "მუქი ბელგიური შოკოლადის განაშით, კარამელიზებული ბანანითა და შოკოლადის ფანტელებით.",
    "detailedDesc": "შოკოლადის მოყვარულთა ნამდვილი ოცნება. ცხელი ხრაშუნა ვაფლი უხვად დაფარული პრემიუმ ბელგიური მუქი შოკოლადის თბილი განაშით, ნაზი ბანანის ნაჭრებით, ხრაშუნა კაკაოს კუბიკებითა და შვეიცარიული შოკოლადის ფანტელებით.",
    "featuredHome": true,
    "heroImage": "images/waffle-hero-2.png"
  },
  {
    "id": "waffle-3",
    "category": "ვაფლები",
    "title": "კარამელი & პეკანი",
    "price": "₾ 15.90",
    "image": "images/thumb-3.jpg",
    "rating": "5.0",
    "badge": "★ 4.8 • გურმანი",
    "shortDesc": "მოხალული ხრაშუნა პეკანით, მარილიანი ქარვისფერი კარამელითა და კარაქით.",
    "detailedDesc": "მდიდარი და დახვეწილი გემოების ჰარმონია. ოქროსფრად გამომცხვარი ვაფლი, რომელიც გაჟღენთილია ხელნაკეთი მარილიანი კარამელით, მოხალული არომატული პეკანის კაკლითა და ნამდვილი ფრანგული კარაქის ნაზი კრემით.",
    "featuredHome": true,
    "heroImage": "images/waffle-hero-3.png"
  },
  {
    "id": "waffle-4",
    "category": "ვაფლები",
    "title": "ტყის კენკრა",
    "price": "₾ 15.50",
    "image": "images/thumb-4.jpg",
    "rating": "5.0",
    "badge": "★ 4.9 • კენკროვანი",
    "shortDesc": "ჟოლოს, მაყვლისა და მარწყვის მიქსით, ყვავილის თაფლითა და შაქრის პუდრით.",
    "detailedDesc": "გამაგრილებელი და ხალასი ტყის არომატები. ვაფლი მორთულია ახალი ჟოლოს, მაყვლისა და ველური მარწყვის კენკროვანი ასორტით, მსუბუქი ყვავილის თაფლითა და თოვლივით ნაზი შაქრის პუდრით.",
    "featuredHome": true,
    "heroImage": "images/waffle-hero-4.png"
  },
  {
    "id": "waffle-5",
    "category": "ვაფლები",
    "title": "ჩხირის ვაფლი (სტიკი)",
    "price": "₾ 9.50",
    "image": "images/waffle-stick-caramel.png",
    "rating": "5.0",
    "badge": "★ 4.7 • To-Go",
    "shortDesc": "მოხერხებული ხრაშუნა ვაფლი ჩხირზე, დაფარული შოკოლადითა და ქარვისფერი კარამელით.",
    "detailedDesc": "სწრაფი და მოხერხებული დესერტი სასეირნოდ! ხრაშუნა ჩხირის ვაფლი ამოვლებული ბელგიურ შოკოლადში, მორთული ფერადი მოსაყრელებითა და ოქროსფერი კარამელის ხაზებით.",
    "featuredHome": false,
    "heroImage": "images/waffle-stick-caramel.png"
  },
  {
    "id": "topping-1",
    "category": "ტოპინგები",
    "title": "შოკოლადი & სიროფები",
    "price": "₾ 3.50",
    "image": "images/topping-choco.jpg",
    "rating": "5.0",
    "badge": "ბელგიური",
    "shortDesc": "ბელგიური მუქი, რძიანი და თეთრი შოკოლადი, ნუტელა, თბილი განაში.",
    "detailedDesc": "უმაღლესი ხარისხის ბელგიური შოკოლადის პრემიუმ არჩევანი: ცხელი მუქი განაში, ნაზი რძიანი შოკოლადის სოუსი, ორიგინალი ნუტელა და ნეკერჩხლის არომატული სიროფი თქვენი ვაფლისთვის.",
    "featuredHome": false,
    "heroImage": "images/topping-choco.jpg"
  },
  {
    "id": "topping-2",
    "category": "ტოპინგები",
    "title": "ახალი ხილი & კენკრა",
    "price": "₾ 4.00",
    "image": "images/topping-berries.jpg",
    "rating": "5.0",
    "badge": "100% ახალი",
    "shortDesc": "სურნელოვანი მარწყვი, ველური მოცვი, ჟოლო, ბანანი და კივი.",
    "detailedDesc": "ყოველდღიურად შერჩეული უახლესი და უტკბესი ხილი: მინდვრის მარწყვი, მთის მოცვი, სურნელოვანი ჟოლო და ბანანი, დაჭრილი ადგილზე შეკვეთისთანავე.",
    "featuredHome": false,
    "heroImage": "images/topping-berries.jpg"
  },
  {
    "id": "topping-3",
    "category": "ტოპინგები",
    "title": "იტალიური ჯელატო & ნაღები",
    "price": "₾ 3.80",
    "image": "images/topping-icecream.jpg",
    "rating": "5.0",
    "badge": "ჯელატო",
    "shortDesc": "იტალიური ჯელატო ვანილით, შოკოლადით ან პისტაციით, ათქვეფილი ნაღები.",
    "detailedDesc": "იტალიური კლასიკური ნაყინის (ჯელატოს) ბურთულა თქვენი არჩევით — მადაგასკარის ვანილი, მუქი შოკოლადი ან პისტაცია — შეხამებული ფაფუკ ბელგიურ ნაღებთან.",
    "featuredHome": false,
    "heroImage": "images/topping-icecream.jpg"
  },
  {
    "id": "topping-4",
    "category": "ტოპინგები",
    "title": "მოხალული თხილი & ხრაშუნები",
    "price": "₾ 2.80",
    "image": "images/topping-crunch.jpg",
    "rating": "5.0",
    "badge": "ხრაშუნა",
    "shortDesc": "მოხალული ნუში, პეკანი, ფისტა, ორეოს ნამცხვრები და მარილიანი კარამელი.",
    "detailedDesc": "იდეალური ტექსტურის კონტრასტი: მოხალული დაქუცმაცებული პეკანი, ხრაშუნა ნუშის ფანტელები, ნამდვილი ორეოს ნამსხვრევები და კარამელიზებული ხრაშუნები.",
    "featuredHome": false,
    "heroImage": "images/topping-crunch.jpg"
  },
  {
    "id": "drink-1",
    "category": "სასმელები",
    "title": "ესპრესო & კაპუჩინო",
    "price": "₾ 5.50",
    "image": "images/drink-coffee.jpg",
    "rating": "5.0",
    "badge": "არაბიკა",
    "shortDesc": "100% არაბიკას ახალმოხალული მარცვლები, ნაზი რძის ქაფით.",
    "detailedDesc": "სპეციალურად შერჩეული პრემიუმ არაბიკას მარცვლებისგან მომზადებული არომატული ყავა: კლასიკური ესპრესო, ორმაგი ამერიკანო, ხავერდოვანი კაპუჩინო ან ლატე.",
    "featuredHome": false,
    "heroImage": "images/drink-coffee.jpg"
  },
  {
    "id": "drink-2",
    "category": "სასმელები",
    "title": "ციტრუსის ლიმონათი",
    "price": "₾ 6.00",
    "image": "images/drink-lemonade.jpg",
    "rating": "5.0",
    "badge": "ხელნაკეთი",
    "shortDesc": "ხელნაკეთი გამაგრილებელი ლიმონათი პიტნით, ლაიმითა და ჯანჯაფილით.",
    "detailedDesc": "ადგილზე დამზადებული ნატურალური ციტრუსის ლიმონათი ახალი ლაიმით, ლიმონით, მწვანე პიტნის ფოთლებით, ყინულით და მსუბუქი ცქრიალა წყაროს წყლით.",
    "featuredHome": false,
    "heroImage": "images/drink-lemonade.jpg"
  },
  {
    "id": "drink-3",
    "category": "სასმელები",
    "title": "გამაგრილებელი სასმელები",
    "price": "₾ 4.00",
    "image": "images/drink-cola.jpg",
    "rating": "5.0",
    "badge": "ცივი",
    "shortDesc": "კოკა-კოლა, კოლა ზერო, სპრაიტი, ფანტა ყინულით.",
    "detailedDesc": "ყინულივით ცივი კოკა-კოლა (კლასიკური ან უშაქრო ზერო), სპრაიტი ან ფანტა, მირთმეული ლიმონის ნაჭრითა და ყინულის კუბიკებით.",
    "featuredHome": false,
    "heroImage": "images/drink-cola.jpg"
  },
  {
    "id": "drink-4",
    "category": "სასმელები",
    "title": "არომატული ჩაი",
    "price": "₾ 4.50",
    "image": "images/drink-tea.jpg",
    "rating": "5.0",
    "badge": "ორგანული",
    "shortDesc": "მწვანე ჟასმინით, შავი ერლ გრეი ან ველური კენკრის ხილის ჩაი.",
    "detailedDesc": "ცხელი ფოთლოვანი ჩაის მდიდარი ასორტიმენტი: ერლ გრეი ბერგამოტით, მწვანე ჩაი ჟასმინით, ტყის კენკროვანი მცენარეული ჩაი თაფლითა და ლიმონით.",
    "featuredHome": false,
    "heroImage": "images/drink-tea.jpg"
  },
  {
    "id": "extra-1",
    "category": "ექსტრა",
    "title": "თბილი შოკოლადის დიპი",
    "price": "₾ 4.00",
    "image": "images/extra-dip.jpg",
    "rating": "5.0",
    "badge": "დიპი",
    "shortDesc": "ცალკე ჭიქით თბილი ბელგიური შოკოლადის დიპი ჩასაწობად.",
    "detailedDesc": "სპეციალური ჭიქით მირთმეული თბილი ბელგიური გამდნარი შოკოლადის დიპი, რომელშიც შეგიძლიათ ჩააწოთ ვაფლის თითოეული ხრაშუნა ლუკმა.",
    "featuredHome": false,
    "heroImage": "images/extra-dip.jpg"
  },
  {
    "id": "extra-2",
    "category": "ექსტრა",
    "title": "პრემიუმ სასაჩუქრე ყუთი",
    "price": "₾ 8.00",
    "image": "images/extra-box.jpg",
    "rating": "5.0",
    "badge": "სასაჩუქრე",
    "shortDesc": "პრემიუმ შეფუთვა ბაფთით, იდეალური საჩუქრად და წასაღებად.",
    "detailedDesc": "ელეგანტური ოქროსფერი და შავი სასაჩუქრე ყუთი WAFF-ის ლოგოთი და ბაფთით. ინარჩუნებს ვაფლის სითბოსა და ხრაშუნს ტრანსპორტირებისას.",
    "featuredHome": false,
    "heroImage": "images/extra-box.jpg"
  },
  {
    "id": "extra-3",
    "category": "ექსტრა",
    "title": "ჰაეროვანი ბელგიური ნაღები",
    "price": "₾ 3.00",
    "image": "images/extra-cream.jpg",
    "rating": "5.0",
    "badge": "ნაღები",
    "shortDesc": "დამატებითი პორცია ჰაეროვანი ათქვეფილი ნაღებისა.",
    "detailedDesc": "უმაღლესი ცხიმიანობის ნამდვილი ნაღები, ათქვეფილი მსუბუქ ვანილის შაქართან ერთად — შეუდარებელი დანამატი ნებისმიერი ვაფლისთვის.",
    "featuredHome": false,
    "heroImage": "images/extra-cream.jpg"
  },
  {
    "id": "extra-4",
    "category": "ექსტრა",
    "title": "კანადური ნეკერჩხლის სიროფი",
    "price": "₾ 3.50",
    "image": "images/extra-syrup.jpg",
    "rating": "5.0",
    "badge": "კანადური",
    "shortDesc": "ნატურალური კანადური ნეკერჩხლის ოქროსფერი სიროფი.",
    "detailedDesc": "ორიგინალი Grade-A კანადური ნეკერჩხლის სუფთა სიროფი, ტრადიციული ხის არომატითა და ოქროსფერი ტკბილი გემოთი.",
    "featuredHome": false,
    "heroImage": "images/extra-syrup.jpg"
  },
  {
    "id": "extra-5",
    "category": "ექსტრა",
    "title": "სადღესასწაულო ნაკრები",
    "price": "₾ 5.00",
    "image": "images/extra-candle.jpg",
    "rating": "5.0",
    "badge": "ზეიმი",
    "shortDesc": "სადღესასწაულო სანთელი, მისალოცი ბარათი და სადღესასწაულო გაფორმება.",
    "detailedDesc": "დაბადების დღისა და დღესასწაულების კომპლექტი: მოციმციმე სადღესასწაულო სანთელი, WAFF-ის ხელნაწერი მისალოცი ბარათი და სადღესასწაულო გაფორმება.",
    "featuredHome": false,
    "heroImage": "images/extra-candle.jpg"
  }
];

function getStoredMenu() {
  try {
    const raw = localStorage.getItem(WAFF_STORAGE_KEYS.MENU);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure featuredHome exists on each item
        let featuredCount = 0;
        parsed.forEach((item, idx) => {
          if (item.featuredHome === undefined) {
            item.featuredHome = idx < 4;
          }
          if (item.featuredHome) featuredCount++;
        });
        if (featuredCount === 0 && parsed.length >= 4) {
          for (let i = 0; i < 4; i++) parsed[i].featuredHome = true;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading menu storage:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_MENU_ITEMS));
}

function saveMenu(items) {
  try {
    localStorage.setItem(WAFF_STORAGE_KEYS.MENU, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('waff_menu_updated', { detail: items }));
    return true;
  } catch (e) {
    console.error('Error saving menu:', e);
    return false;
  }
}

function getFeaturedHomeItems() {
  const items = getStoredMenu();
  let featured = items.filter(i => i.featuredHome === true);
  if (featured.length === 0) {
    featured = items.slice(0, 4);
  }
  return featured.slice(0, 4);
}

function toggleFeaturedHome(productId) {
  const items = getStoredMenu();
  const item = items.find(i => String(i.id) === String(productId));
  if (!item) return { success: false, message: 'პროდუქტი ვერ მოიძებნა' };

  const currentFeatured = items.filter(i => i.featuredHome === true);
  if (!item.featuredHome && currentFeatured.length >= 4) {
    return { 
      success: false, 
      message: 'მთავარ გვერდზე მაქსიმუმ 4 პროდუქტი შეიძლება იყოს. ჯერ სხვა ამოიღეთ.' 
    };
  }

  item.featuredHome = !item.featuredHome;
  saveMenu(items);
  return { 
    success: true, 
    featuredHome: item.featuredHome,
    message: item.featuredHome ? `„${item.title}“ დაემატა მთავარზე! ⭐` : `„${item.title}“ ამოღებულია მთავარიდან.`
  };
}

function resetToDefaultMenu() {
  try {
    localStorage.removeItem(WAFF_STORAGE_KEYS.MENU);
    const defaults = JSON.parse(JSON.stringify(DEFAULT_MENU_ITEMS));
    window.dispatchEvent(new CustomEvent('waff_menu_updated', { detail: defaults }));
    return defaults;
  } catch (e) {
    return DEFAULT_MENU_ITEMS;
  }
}

function getAdminPassword() {
  try {
    return localStorage.getItem(WAFF_STORAGE_KEYS.PASS) || 'admin';
  } catch (e) {
    return 'admin';
  }
}

function setAdminPassword(newPass) {
  try {
    localStorage.setItem(WAFF_STORAGE_KEYS.PASS, newPass);
    return true;
  } catch (e) {
    return false;
  }
}

function verifyAdminPassword(pass) {
  return String(pass).trim() === getAdminPassword();
}

function isAdminLoggedIn() {
  try {
    return sessionStorage.getItem(WAFF_STORAGE_KEYS.AUTH) === 'true';
  } catch (e) {
    return false;
  }
}

function setAdminLoggedIn(state) {
  try {
    if (state) {
      sessionStorage.setItem(WAFF_STORAGE_KEYS.AUTH, 'true');
    } else {
      sessionStorage.removeItem(WAFF_STORAGE_KEYS.AUTH);
    }
  } catch (e) {}
}
