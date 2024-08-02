let portraits_data = [
    ["550083", "jpg", "Portrait of Ester Wegelius (née Tawaststjerna)", "Oskari Paatela"],
    ["589324", "webp", "Ilya Repin with his works at the Ateneum", "unknown artist"],
    ["503687", "webp", "Parisian Model in a Dressing Gown (Parisian Model in Robe)", "Albert Edelfelt"],
    ["564196", "jpg", "Portrait of the Poet Bertel Gripenberg", "Albert Edelfelt"],
    ["1675717", "webp", "Nikolai Sinebrychoff", "Johan Erik Lindh"],
    ["382079", "jpg", "The Philologist and the Counsellor of Secretary Johan Ihre", "Gustaf Lundberg"],
    ["586070", "jpg", "Paraske kanteleineen", "Albert Edelfelt"],
    ["405126", "jpg", "Irma", "Beda Stjernschantz"],
    ["5637849", "webp", "Portrait of Signe Kolster", "Albert Edelfelt"],
    ["579382", "jpg", "Martin de Vos", "Karel Dujardin"],
    ["378849", "webp", "Colonel Henrik Falkenberg af Bålby", "Johan Henrik Scheffel"],
    ["436101", "jpg", "Portrait of Johan Knutson", "Nils Jakob Olsson Blommér"],
    ["397388", "jpg", "Portrait of the Sculptor C. E. Sjöstrand", "Hilda Eloise Granstedt"],
    ["623215", "webp", "Portrait of a Boy", "Frans Luyckx"],
    ["389031", "jpg", "Maria Odilia Buys", "Jan Anthonisz. van Ravesteyn"],
    ["624605", "webp", "Laihian kirkkoherra Samuel Wacklinin rouva Elisabeth Björman", "Isak Wacklin"],
    ["381195", "jpg", "Anna Carolina Willman", "Lorentz Lars Svensson Sparrgren"],
    ["383088", "webp", "Sophia Magdalena, Queen of Sweden", "Alexander Roslin (studio)"],
    ["621445", "jpg", "Baron Johan Wilhelm Sprengporten", "Gustaf Lundberg"],
    ["440012", "jpg", "Portrait of Lieutenant Alexandre Weissgerber de Stragéwicz as a Child", "Albert Edelfelt"],
    ["573118", "jpg", "Portrait of Count C.G. Mannerheim, After Pierre Francois Eugene Giraud", "Emile Lassalle"],
    ["519791", "jpg", "Jan van Goyen", "Karel de Moor"],
    ["380287", "webp", "Court Architect Göran Josuæ Adelcrantz", "Georg Engelhard Schröder"],
    ["389373", "webp", "Adolph Fredrick, King of Sweden", "Lorens Pasch nuorempi / den yngre / the Younger (studio)"],
    ["380786", "jpg", "Anna Dorothea Amiga", "David von Krafft"],
    ["441746", "webp", "Vanha eukko", "Akseli Gallen-Kallela"],
    ["574389", "jpg", "Carl Gustaf Estlander, kipsimalli", "Johannes Takanen"],
    ["610651", "webp", "Baron Nils Palmstjerna", "Olof Arenius"],
    ["380052", "jpg", "Ulrika Lovisa Tessin", "Jakob Björk"],
    ["378746", "webp", "Portrait of a Lady", "Olof Arenius"],
    ["386751", "jpg", "Portrait of a man", "Friedemann"],
    ["401096", "webp", "Count Karl Lagerbring", "Carl Fredrik von Breda"],
    ["381153", "jpg", "Portrait of a lady", "Alessandro Allori (circle)"],
    ["379786", "webp", "Mayor Jonas Robeck", "Jonas Hoffman"],
    ["610068", "webp", "Eva Raye", "Jan Daemen Cool"],
    ["419998", "webp", "Princess Jekaterina Orlova", "unknown artist"],
    ["392486", "webp", "Captain Carl Adolf Möllersvärd", "Ulrica Fredrica Pasch"],
    ["395360", "jpg", "The Silk Manufacturer Carl Edvin Lundgren", "Gustaf Wilhelm Finnberg"],
    ["383566", "webp", "Portrait of a young lady", "Nicolaes Maes"],
    ["387383", "jpg", "Portrait of a man", "Andrew Robertson"],
    ["477370", "webp", "Portrait of Ms. Anna Krogius", "Nils Schillmark"],
    ["400537", "jpg", "Portrait of the Artist Elizaveta Zvantseva", "Ilja Repin"],
    ["610337", "jpg", "Portrait of Baron Carl Johan Walleen", "Johan Erik Lindh"],
    ["619922", "jpg", "Portrait of Nils Henrik Pinello", "Fredrik Ahlstedt"],
    ["384900", "webp", "Portrait of Carl Johan von Schultzenheim", "Ulrica Fredrica Pasch"],
    ["501893", "webp", "Portrait of Carl Gustaf Mannerheim", "Gustaf Wilhelm Finnberg"],
    ["1875369", "webp", "Portrait of Mrs. White", "Henry Raeburn"],
    ["388569", "jpg", "Portrait of a Young Man Holding a Glove, copy after Frans Hals", "Helene Schjerfbeck"],
    ["429344", "webp", "Portrait of the Artist's Mother Alexandra Edelfelt", "Albert Edelfelt"],
    ["429434", "webp", "Portrait of a Woman", "Arvid Liljelund"],
    ["509606", "jpg", "Portrait of a Woman", "Akseli Gallen-Kallela"],
    ["397599", "webp", "Portrait of the Artist Eric O. W. Ehrström", "Albert Edelfelt"],
    ["411226", "webp", "Portrait of Albert Edelfelt", "Pascal-Adolphe-Jean Dagnan-Bouveret"],
    ["612302", "jpg", "Portrait of a Lady", "Lorens Pasch nuorempi / den yngre / the Younger"],
    ["616841", "jpg", "Portrait of a man", "Francisco Herrera vanhempi / den äldre / the Elder"],
    ["386156", "jpg", "Portrait of Frithiof Holmberg", "Werner Holmberg"],
    ["605336", "jpg", "Portrait of a Man", "unknown artist"],
    ["445683", "jpg", "Portrait of Sigrid af Forselles", "Venny Soldan-Brofeldt"],
    ["432749", "webp", "Portrait of the Artist's Sister Berta Edelfelt", "Albert Edelfelt"],
    ["396120", "jpg", "Portrait of Professor Carl Gustaf Estlander", "Albert Edelfelt"],
    ["419846", "jpg", "Portrait of Boileau", "Pierre Drevet"],
    ["412519", "webp", "Portrait of a Young Girl", "Magnus Enckell"],
    ["437254", "jpg", "Portrait of a Woman, Face", "Albert Edelfelt"],
    ["431090", "webp", "Portrait of a Man", "Arvid Liljelund"],
    ["432180", "jpg", "Portrait of a Lady", "Gunnar Berndtson"],
    ["504081", "jpg", "Portrait of Wäinö Walli", "Oskari Paatela"],
    ["422196", "jpg", "Portrait of a Man", "Isak Wacklin"],
    ["389335", "webp", "Portrait of a 22-Year-Old Woman", "Nicolaes Eliasz. Pickenoy"],
    ["461201", "jpg", "Portrait of Gunnar Berndtson", "Eero Järnefelt"],
    ["390052", "webp", "Portrait of King Adolf Fredrik", "Lorens Pasch nuorempi / den yngre / the Younger"],
    ["388827", "jpg", "Portrait of the Authoress Sara Wacklin", "Johan Erik Lindh"],
    ["464988", "jpg", "Portrait of a young woman", "Jacob van Utrecht"],
    ["380095", "jpg", "Portrait of a Young Woman", "Isaac de Jouderville"],
    ["487231", "webp", "Portrait of a Young Woman", "Albert Edelfelt"],
    ["496526", "jpg", "Portrait of Eva Törngren", "Johan Erik Lindh"],
    ["619621", "jpg", "Portrait of Count R. H. Rehbinder", "Johan Erik Lindh"],
    ["478613", "jpg", "Portrait of a Man", "Isak Wacklin"],
    ["450290", "webp", "Portrait of Hans Peter Købke, the Artist's Brother", "Christen Købke"],
    ["428687", "jpg", "Portrait of Mrs. Dagmar Dippell, compositional sketch", "Albert Edelfelt"],
    ["466023", "jpg", "Portrait of Valle Rosenberg", "William Lönnberg"],
    ["407127", "jpg", "Portrait of C.E.Sjöstrand", "Fredrik Ahlstedt"],
    ["393899", "webp", "Portrait of the Authoress Elsa Lindberg", "Albert Edelfelt"],
    ["383890", "jpg", "René Descartes", "Pierre Michel Alix"],
    ["573134", "jpg", "Portrait of Professor G.G. Hällström, after Pierre Fr. Giraud", "Emile Lassalle"],
    ["497595", "webp", "Portrait of Christina Agatha Silfersparre", "Nils Schillmark"],
    ["616333", "webp", "Portrait of Baron R. F. G. Wrede", "Gustaf Wilhelm Finnberg"],
    ["431567", "webp", "Portrait of Tekla Hultin", "Eero Järnefelt"],
    ["392006", "webp", "Portrait of a young man", "Margaretha Wulfraet"],
    ["539335", "jpg", "Portrait of a Young Man", "Bernard Vogel"],
    ["393520", "webp", "Portrait of a 66-Year-Old Man", "Michiel van Mierevelt"],
    ["472244", "webp", "Portrait of Mrs. Agda Vilén", "Magnus Enckell"],
    ["378911", "jpg", "Rembrandtin vaimo", "Richard Earlom"],
    ["382703", "jpg", "Portrait of the Duke of Wellington", "George Raphael Ward"],
    ["386143", "jpg", "Portrait of a man", "Georg Desmarées"],
    ["428835", "jpg", "Portrait of August Streng", "Albert Edelfelt"],
    ["399066", "jpg", "Portrait of the Artist's Daughter, Nadezhda (Nadya) Repina", "Ilja Repin"],
    ["399436", "webp", "Portrait of A. W. Finch", "Magnus Enckell"],
    ["467617", "jpg", "Muotokuvaluonnos", "Verner Thomé"],
    ["411681", "webp", "Self-Portrait", "Joshua Reynolds"],
    ["400917", "webp", "Nuori tyttö", "Louis-Marin Bonnet"],
    ["381439", "webp", "Lord Chamberlain Gustaf Jakob Horn af Rantzien", "Olof Arenius"],
    ["390771", "webp", "Toini Nikander (Antonietta Toini)", "Antti Favén"],
    ["389474", "jpg", "Tanner Jacob Westin the elder", "Johan Henrik Scheffel"],
    ["466946", "webp", "Self-Portrait", "Kristian Zahrtmann"],
    ["432088", "webp", "Ellen Edelfelt", "Albert Edelfelt"],
    ["409365", "jpg", "Miss Heckford", "Isak Wacklin"],
    ["501323", "jpg", "Omakuva paletti kädessä", "Ferdinand von Wright"],
    ["469095", "jpg", "Isak Edvard Wacklin, the Artist´s Son", "Isak Wacklin"],
    ["540600", "jpg", "Johann Kupezkyn omakuva", "Johann Elias Haid"],
    ["404783", "jpg", "Vapaaherratar Ulrica Fredrika Cedercreutz", "Gustaf Lundberg"],
    ["1675732", "webp", "Nicolas Sinebrychoff", "Eero Järnefelt"],
    ["379180", "webp", "Maria Charlotta Wrangel", "Johan Joachim Streng"],
    ["480319", "jpg", "Marie von Heiroth", "Hugo Simberg"],
    ["388423", "jpg", "English singer", "Carl Fredrik von Breda"],
    ["421928", "webp", "Prince Grigori Orlov", "unknown artist"],
    ["385515", "webp", "Eleonora Gustafa Bonde af Björnö", "Jakob Björk"],
    ["380516", "webp", "Louise Ulrica, Queen of Sweden", "Lorens Pasch nuorempi / den yngre / the Younger (studio)"],
    ["3165110", "webp", "Anna Kjöllerfeldt, nee Sinebrychoff (1854–1943)", "Elisabeth Keyser"],
    ["387925", "webp", "Gustav III, King of Sweden", "Alexander Roslin (studio)"],
    ["519723", "jpg", "Monsieur Frigot", "Jean-François Millet"],
    ["380605", "jpg", "Archduchess Isabella’s Maid", "Carl Fredrik von Breda"],
    ["3165122", "webp", "Anna Sinebrychoff (1854–1943) as a Child", "unknown artist"],
    ["403753", "jpg", "Mme Saussine", "Albert Edelfelt"],
    ["523631", "jpg", "Self-Portrait", "Valle Rosenberg"],
    ["5665078", "webp", "Françoise Marguerite de Sévigné, Countess of Grignan", "Alexander Roslin"],
    ["390136", "jpg", "Maria Charlotta Silfverstjerna", "Johan Henrik Scheffel"],
    ["385435", "webp", "Self-Portrait", "Adolf von Becker"],
    ["381280", "jpg", "Maria Ulrika Dævel", "Gustaf Lundberg"],
    ["382555", "webp", "Countess Jacqueline Elisabet Gyldenstolpe", "Jakob Björk"],
    ["380702", "jpg", "The Poet Gustaf Fredrik Gyllenborg", "Gustaf Lundberg"],
    ["396922", "jpg", "Self-Portrait", "Victor Westerholm"],
    ["383358", "jpg", "Tytön pää", "Hanna Frosterus-Segerstråle"],
    ["399658", "webp", "Self-Portrait, Black Background", "Helene Schjerfbeck"],
    ["432368", "jpg", "The Sick Woman", "Einar Ilmoni"],
    ["483310", "jpg", "Man", "Ilmari Aalto"],
    ["379321", "webp", "Countess Ulrika Eleonora von Fersen", "Gustaf Lundberg"],
    ["465109", "webp", "Tilanomistaja, tuomari Albert Johan Lignell", "Gustaf Wilhelm Finnberg"],
    ["398016", "jpg", "Clock-Maker", "Yrjö Ollila"],
    ["475551", "jpg", "Esikuntakapteeni Danielsson", "Wilhelm von Wright"],
    ["387857", "jpg", "Maria Juliana Bedoire", "Olof Arenius"],
    ["380794", "jpg", "Lady Werner", "Gustaf Lundberg"],
    ["394584", "jpg", "Self-portrait ’en face’", "Akseli Gallen-Kallela"],
    ["542119", "jpg", "Joh. Theodor Eller", "Georg Friedrich Schmidt"],
    ["469856", "webp", "Gustaf Fredrik Wrede", "Gustaf Wilhelm Finnberg"],
    ["485785", "webp", "Gustaf Borgström", "Nils Schillmark"],
    ["457364", "webp", "Composer Leevi Madetoja", "Wilho Sjöström"],
    ["382262", "jpg", "Young soldier", "David Andersson von Cöln"],
    ["380051", "webp", "Catharina Grill (?)", "Martin Mijtens vanhempi / den äldre / the Elder"],
    ["380748", "jpg", "Sofia Magdalena, Queen of Denmark", "Johann Salomon Wahl"],
    ["624508", "webp", "Parson of Laihia Samuel Wacklin(1710-1780), the artist's brother", "Isak Wacklin"],
    ["413792", "webp", "Filippo Lippi's Self-Portrait, copy", "Väinö Hämäläinen"],
    ["3165113", "webp", "Emil Kjöllerfeldt", "Elisabeth Keyser"],
    ["455273", "jpg", "Kauppias Mikael Wacklin", "Isak Wacklin"],
    ["479444", "webp", "Emerentia Cygnaeus", "Nils Schillmark"],
    ["479352", "jpg", "An old woman with a distaff", "Giuseppe Nogari"],
    ["381600", "jpg", "Countess Poaton (?)", "Gustaf Lundberg"],
    ["396668", "jpg", "Self-Portrait", "Erik Johan Löfgren"],
    ["390894", "webp", "Jenny Lind \"Norman\"-roolissa", "Maria Röhl"],
    ["583618", "jpg", "Une jeune Mariée", "Noël-François Bertrand"],
    ["407891", "jpg", "Self-Portrait", "Maria Wiik"],
    ["540140", "webp", "Newtonin rintakuva soikiossa", "Johann Friedrich Bolt"],
    ["450920", "jpg", "Self-Portrait", "Kosti Meriläinen"],
    ["451002", "jpg", "Self-Portrait", "Dora Wahlroos"],
    ["511825", "webp", "Self Portrait", "Yrjö Ollila"],
    ["404399", "webp", "Self Portrait", "Juho Kyyhkynen"],
    ["520950", "webp", "Ophelia", "Joseph Mordecai"],
    ["384608", "jpg", "Portrait of the Artist's Daughter Mary", "Franz von Stuck"],
    ["409122", "jpg", "Prince Vasili Vasiljevits Dolgoruki", "Carl Christian Vogel von Vogelstein"],
    ["387416", "jpg", "Countess Antoinetta Virginia Gyllenborg", "Jakob Björk"],
    ["1675734", "webp", "Paul Sinebrychoff nuorempi", "unknown artist"],
    ["5584956", "webp", "Miehen muotokuva", "Severin Falkman"],
    ["380447", "jpg", "Oskar I as crownprince", "Lorentz Lars Svensson Sparrgren"],
    ["597406", "jpg", "Seneca, veistospää", "Lucas Vorsterman"],
    ["1953352", "webp", "Gunnar Berndtson, ajoitus n. 1880", "Daniel Nyblin"],
    ["429822", "jpg", "Jean de La Fontaine", "Henri Millot"],
    ["381958", "webp", "Kalenterikuva Floreal (Vallankumousvuoden 8. kuukausi 21. huhti.-21.toukok.)", "Salvatore Tresca"],
    ["472468", "jpg", "F. M. Maexmontan as a Child", "Johan Erik Lindh"],
    ["386006", "webp", "Model", "Hanna Bergh"],
    ["506451", "jpg", "Daughter of the Artist", "William Lönnberg"],
    ["394057", "webp", "M:lle Malbrande, naisenpää", "Albert Edelfelt"],
    ["490877", "jpg", "Girl with Grapes", "Yrjö Ollila"],
    ["391789", "webp", "Catharina Charlotta L'Estrade", "Ulrica Fredrica Pasch"],
    ["395949", "jpg", "Portrait of Victoria Åberg", "Bertha Froriep"],
    ["453905", "jpg", "A Tyrolean Girl", "Zélé Agricola"],
    ["430669", "jpg", "Girl with a Rake, Study for August", "Albert Edelfelt"],
    ["428541", "webp", "Portrait of Baron Johan Philip Palmén, Vice Chancellor of the University", "Eero Järnefelt"],
    ["480056", "jpg", "Bacchus", "Jacob Adriaensz. Backer (follower)"],
    ["401710", "webp", "Female Nude", "Georges Lemmen"],
    ["381133", "webp", "Countess Ingeborg Posse", "Martin Mijtens vanhempi / den äldre / the Elder"],
    ["392614", "jpg", "Baron Thure Leonard Klinckowström", "Alexander Roslin"],
    ["540318", "jpg", "Taiteilijan puoliso, Dorothee Louise Viedebandt kirjan ääressä", "Georg Friedrich Schmidt"],
    ["413058", "jpg", "Actress Anna Sofia Hagman", "Carl Fredrik von Breda"],
    ["385335", "webp", "Hedvig Ulrika Hedengran", "Ulrica Fredrica Pasch"],
    ["464623", "jpg", "Girl Knitting", "Aukusti Uotila"],
    ["621144", "webp", "Boy Sitting", "Verner Thomé"],
    ["521819", "webp", "Girl with Anemones", "Juho Salminen"],
    ["1740643", "webp", "Portrait of Inge Simberg", "Hugo Simberg"],
    ["591239", "jpg", "J.B. Barbé", "unknown artist"],
    ["416554", "webp", "Self-Portrait", "Sigfrid August Keinänen"],
    ["619253", "jpg", "The Customs Officer G. A. Hobin", "Gustaf Wilhelm Finnberg"],
    ["466345", "jpg", "Silinterihattuinen mies", "Verner Thomé"],
    ["397249", "jpg", "The Wounded Soldier from the Poem Döbeln at Jutas", "Albert Edelfelt"],
    ["590782", "jpg", "Margareta Lotringilainen", "unknown artist"],
    ["382131", "jpg", "King Karl XIV Johan", "Lorentz Lars Svensson Sparrgren"],
    ["378900", "jpg", "Countess Margareta Lillienstedt", "David von Krafft"],
    ["379216", "jpg", "Anna Sofia König", "Carl Ludvig von Plötz"],
    ["2093879", "webp", "Tamec, Holding a Shoe", "Maria Wiik"],
    ["535352", "jpg", "Samuel Manasseh ben Israel", "Rembrandt van Rijn"],
    ["390667", "jpg", "Portrait of a Lady", "Ulrica Fredrica Pasch"],
    ["451431", "webp", "Muotokuvaluonnos", "Verner Thomé"],
    ["536590", "webp", "(Unknown)", "Maria Wiik"],
    ["468654", "jpg", "Portrait of the Artist´s sister Miss Hilda Wiik", "Maria Wiik"],
    ["2870938", "webp", "Irma (Portrait of the Artist's Sister)", "Dora Wahlroos"],
    ["394946", "jpg", "Portrait of Marcus Larsson", "Maria Röhl"],
    ["479350", "jpg", "Self-Portrait", "Einar Ilmoni"],
    ["597640", "webp", "Blond Woman", "Helene Schjerfbeck"],
    ["498956", "jpg", "Self-Portrait", "Helene Schjerfbeck"],
    ["482609", "jpg", "Fisherman", "Hugo Simberg"],
    ["384233", "jpg", "Diderot", "Pierre Michel Alix"],
    ["384497", "jpg", "Portrait of Madame de Sévigné", "Pierre Michel Alix"],
    ["401182", "jpg", "En Alsace libérée les petites filles, se restreignent de bon coeur pour hâter la déliverance de l''Alsace encore annedéxe. Faites comme elles (juliste)", "Béatrix Grognuz"],
    ["492601", "webp", "Omakuva ?", "Magnus Enckell"],
];